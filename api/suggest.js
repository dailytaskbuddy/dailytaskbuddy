export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { goal } = req.body;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Break this goal into 5 short actionable tasks (one per line, no numbering, no extra text): ${goal}` }] }]
        })
      }
    );
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const tasks = text.split('\n').filter(t => t.trim());
    res.status(200).json({ tasks });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
