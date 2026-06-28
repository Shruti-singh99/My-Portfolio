export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message, system } = req.body;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, system: system, messages: [{ role: 'user', content: message }] })
    });
    const d = await r.json();
    console.log('RAW:', JSON.stringify(d));
    res.status(200).json({ reply: d?.content?.[0]?.text || 'No text found' });
  } catch (e) {
    res.status(500).json({ reply: e.message });
  }
}
