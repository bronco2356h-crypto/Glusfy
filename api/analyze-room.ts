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
                text: `Analiza esta imagen y responde ÚNICAMENTE con JSON válido, sin texto adicional.

PRIMERO decide si la imagen es válida. Es válida SOLO si muestra claramente el INTERIOR de una cocina o un baño (paredes, suelo y techo visibles, sin cielo ni exterior).

NO es válida si ves cualquiera de esto:
- Exterior: jardín, terraza, piscina, calle, cielo, árboles, césped, horizonte
- Personas, animales, objetos sueltos
- Salón, dormitorio, pasillo, escaleras, garaje, oficina
- Solo fondo: la cocina/baño aparece de fondo de otra cosa

Formato de respuesta si NO es válida:
{"valido":false,"descripcion":"<describe en 5 palabras qué ves>"}

Formato de respuesta si SÍ es válida (cocina o baño interior):
{"valido":true,"largo":<1-15>,"ancho":<1-10>,"alto":<2-4>,"forma":"rectangular|irregular","confianza":"alta|media|baja"}

Referencias para estimar dimensiones:
puerta=2.1m alto, encimera=0.9m alto, WC=0.7m largo, altura estándar=2.5m`,
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

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // Nuevo formato con campo "valido"
      if (parsed.valido === false) {
        return res.json({ error: 'not_a_room', descripcion: parsed.descripcion || 'imagen no válida' });
      }
      if (parsed.valido === true) {
        return res.json({
          largo: Math.min(15, Math.max(1, parseFloat(parsed.largo) || 3.5)),
          ancho: Math.min(10, Math.max(1, parseFloat(parsed.ancho) || 2.5)),
          alto: Math.min(4, Math.max(2, parseFloat(parsed.alto) || 2.5)),
          forma: parsed.forma === 'irregular' ? 'irregular' : 'rectangular',
          confianza: parsed.confianza || 'media',
        });
      }

      // Formato antiguo (fallback)
      if (parsed.error === 'not_a_room') {
        return res.json({ error: 'not_a_room', descripcion: parsed.descripcion || 'imagen no válida' });
      }
      if (parsed.largo) {
        return res.json({
          largo: Math.min(15, Math.max(1, parseFloat(parsed.largo) || 3.5)),
          ancho: Math.min(10, Math.max(1, parseFloat(parsed.ancho) || 2.5)),
          alto: Math.min(4, Math.max(2, parseFloat(parsed.alto) || 2.5)),
          forma: parsed.forma === 'irregular' ? 'irregular' : 'rectangular',
          confianza: parsed.confianza || 'baja',
        });
      }
    }

    throw new Error('Could not parse JSON from response');
  } catch (e) {
    console.error('analyze-room error:', e);
    return res.json({ error: 'api_error' });
  }
}
