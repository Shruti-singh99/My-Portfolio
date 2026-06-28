export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message, system } = req.body;
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: message }] }]
      })
    });
    const d = await r.json();
    console.log('GEMINI:', JSON.stringify(d).slice(0, 500));
    const text = d?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.status(200).json({ reply: text || "I'm not sure — try asking something else!" });
  } catch (e) {
    console.log('ERR:', e.message);
    res.status(500).json({ reply: 'Something went wrong' });
  }
}