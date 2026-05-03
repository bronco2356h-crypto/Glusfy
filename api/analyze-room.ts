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
        model: 'claude-sonnet-4-6',
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
                text: `You are analyzing an image for a home renovation service. Respond ONLY with valid JSON, no other text.

STEP 1: Identify which of these specific objects you can clearly see in the image:
Kitchen objects: kitchen_sink, countertop, kitchen_cabinets, stove, oven, refrigerator, kitchen_faucet
Bathroom objects: toilet, bathtub, shower, bathroom_sink, bathroom_tiles, towel_rail, bidet

STEP 2: The image is VALID only if:
- You can see at least 2 objects from EITHER the kitchen list OR the bathroom list
- The space is clearly indoors (walls, ceiling, floor all visible)
- There are NO outdoor elements (sky, garden, pool, trees, street, grass)

STEP 3: Respond with JSON:

If INVALID (fewer than 2 specific objects found, or outdoor scene):
{"valido":false,"objetos_encontrados":[],"descripcion":"<what you actually see in 5 words>"}

If VALID (kitchen or bathroom with 2+ specific objects):
{"valido":true,"objetos_encontrados":["object1","object2"],"largo":<1-15>,"ancho":<1-10>,"alto":<2-4>,"forma":"rectangular|irregular","confianza":"alta|media|baja"}

Dimension references: standard door=2.1m tall, countertop=0.9m high, toilet=0.7m long, standard ceiling=2.5m`,
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
    console.log('[analyze-room] raw model text:', text);

    // Handle markdown code blocks
    const codeBlock = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const jsonMatch = codeBlock ? [codeBlock[0], codeBlock[1]] : text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      console.log('[analyze-room] parsed:', JSON.stringify(parsed));

      // Nuevo formato con campo "valido"
      if (parsed.valido === false) {
        return res.json({ error: 'not_a_room', descripcion: parsed.descripcion || 'imagen no válida', _v: 3 });
      }
      if (parsed.valido === true) {
        return res.json({
          largo: Math.min(15, Math.max(1, parseFloat(parsed.largo) || 3.5)),
          ancho: Math.min(10, Math.max(1, parseFloat(parsed.ancho) || 2.5)),
          alto: Math.min(4, Math.max(2, parseFloat(parsed.alto) || 2.5)),
          forma: parsed.forma === 'irregular' ? 'irregular' : 'rectangular',
          confianza: parsed.confianza || 'media',
          _v: 3,
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
