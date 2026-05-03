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
                text: `Eres un técnico de reformas analizando fotos para dar presupuestos.

REGLA PRINCIPAL: La foto debe mostrar el INTERIOR de una cocina o un baño como tema principal. Si hay personas, animales, o si la cocina/baño solo aparece de fondo, NO es válida.

Rechaza la foto (responde con el JSON de error) si:
- El tema principal son personas o hay personas en primer plano
- Es un animal
- Es un exterior, jardín, calle
- Es un salón, dormitorio, pasillo, oficina
- Es un objeto, producto, comida
- La cocina/baño solo aparece de fondo o parcialmente

Solo acepta si la foto muestra CLARAMENTE el interior de una cocina o baño vacíos o en proceso de reforma, donde se pueden medir las paredes.

Si NO es válida, responde EXACTAMENTE:
{"error":"not_a_room","descripcion":"<describe en español qué ves realmente, máx 8 palabras>"}

Si SÍ es una cocina o baño claramente fotografiado para reforma, estima dimensiones:
- Altura de puerta: ~2,1 m
- Encimera: ~0,9 m alto, ~0,6 m fondo
- Sanitario WC: ~0,7 m largo
- Azulejo estándar: 20x20 o 30x30 cm
- Altura estándar: 2,5 m (moderno), 2,8-3 m (antiguo)

Responde ÚNICAMENTE con JSON válido, sin texto adicional:
{
  "largo": <número 1-15 en metros, un decimal>,
  "ancho": <número 1-10 en metros, un decimal>,
  "alto": <número 2-4 en metros, un decimal>,
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
