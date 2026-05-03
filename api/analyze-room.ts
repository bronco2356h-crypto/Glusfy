/// <reference types="node" />

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64, mediaType } = req.body;

  if (!imageBase64 || !mediaType) {
    return res.status(400).json({ error: 'Missing imageBase64 or mediaType' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mediaType, data: imageBase64 },
              },
              {
                type: 'text',
                text: `Eres un validador estricto de imágenes para un servicio de reformas de interiores.

PASO 1 — VALIDACIÓN (obligatorio antes de todo):
Responde internamente a estas preguntas:
1. ¿La imagen muestra el INTERIOR (hay techo visible) de una cocina o baño?
2. ¿El espacio es el tema principal (no el fondo de una foto de personas/animales)?
3. ¿NO hay cielo, jardín, piscina, terraza, calle ni exterior visible?
4. ¿NO es un salón, dormitorio, pasillo, oficina, garaje?

Si cualquier respuesta es NO → RECHAZA.

RECHAZA SIEMPRE si ves:
- Cielo, nubes, horizonte, vegetación exterior, jardín, piscina, terraza
- Personas o animales como tema principal
- Salón, comedor, dormitorio, pasillo, garaje, escaleras
- Comida, objetos sueltos, ropa, pantallas
- Foto borrosa o demasiado oscura para distinguir el espacio

Si rechazas, responde EXACTAMENTE (sin más texto):
{"error":"not_a_room","descripcion":"<qué ves realmente, máx 6 palabras en español>"}

SOLO acepta si ves claramente paredes interiores + suelo + techo de una COCINA (encimera, muebles cocina, fregadero) o BAÑO (sanitarios, azulejos de baño, ducha, bañera).

Si aceptas, estima dimensiones con estas referencias:
- Puerta estándar: 2,1 m alto, 0,8 m ancho
- Encimera cocina: 0,9 m alto, 0,6 m fondo
- Sanitario WC: 0,7 m largo
- Altura libre: 2,5 m (moderno), 2,8 m (antiguo)

Responde ÚNICAMENTE con JSON, sin texto adicional:
{
  "largo": <número 1-15, un decimal>,
  "ancho": <número 1-10, un decimal>,
  "alto": <número 2-4, un decimal>,
  "forma": "<'rectangular' o 'irregular'>",
  "confianza": "<'alta', 'media' o 'baja'>"
}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // IA detectó que no es cocina/baño
      if (parsed.error === 'not_a_room') {
        return res.json({ error: 'not_a_room', descripcion: parsed.descripcion || 'imagen no válida' });
      }

      return res.json({
        largo: Math.min(15, Math.max(1, parseFloat(parsed.largo) || 3.5)),
        ancho: Math.min(10, Math.max(1, parseFloat(parsed.ancho) || 2.5)),
        alto: Math.min(4, Math.max(2, parseFloat(parsed.alto) || 2.5)),
        forma: parsed.forma === 'irregular' ? 'irregular' : 'rectangular',
        confianza: parsed.confianza || 'baja',
      });
    }

    throw new Error('Could not parse JSON from response');
  } catch (e) {
    console.error('analyze-room error:', e);
    return res.json({ error: 'api_error' });
  }
}
