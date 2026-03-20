export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body = '';
    if (typeof req.body === 'string') {
      body = JSON.parse(req.body);
    } else {
      body = req.body;
    }

    const goal = body.goal || 'be productive';

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'List 5 actionable tasks for this goal, one per line, no numbers, no bullets: ' + goal
            }]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (!data.candidates) {
      return res.status(200).json({ error: JSON.stringify(data) });
    }

    const text = data.candidates[0].content.parts[0].text;
    const tasks = text.split('\n').filter(t => t.trim() !== '');
    return res.status(200).json({ tasks });

  } catch(err) {
    return res.status(200).json({ error: err.message });
  }
}
Also update vercel.json — edit it and replace with:
{
  "version": 2,
  "rewrites": [
    { "source": "/api/suggest", "destination": "/api/suggest.js" }
  ]
}
