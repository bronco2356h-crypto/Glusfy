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
                text: `Eres un técnico de reformas experto. Analiza esta foto de una cocina o baño y estima sus dimensiones.

Usa referencias visuales estándar:
- Altura de puerta: ~2,1 m
- Altura de encimera de cocina: ~0,9 m
- Mueble bajo de cocina: ~0,6 m de fondo
- Sanitario WC: ~0,7 m de largo
- Azulejo estándar: 20x20 cm o 30x30 cm
- Altura libre estándar: 2,5 m (pisos modernos), 2,8-3 m (pisos antiguos)

Responde ÚNICAMENTE con un JSON válido, sin texto adicional:
{
  "largo": <número 1-15 en metros, un decimal>,
  "ancho": <número 1-10 en metros, un decimal>,
  "alto": <número 2-4 en metros, un decimal>,
  "forma": "<'rectangular' o 'irregular'>",
  "confianza": "<'alta', 'media' o 'baja'>"
}

Si la imagen no es de una habitación o no puedes estimar, devuelve: {"largo":3.5,"ancho":2.5,"alto":2.5,"forma":"rectangular","confianza":"baja"}`,
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
      // Clamp values to valid ranges
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
    // Fallback — don't block the user
    return res.json({ largo: 3.5, ancho: 2.5, alto: 2.5, forma: 'rectangular', confianza: 'baja' });
  }
}
