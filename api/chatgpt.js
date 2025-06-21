export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { user, history } = req.body;

  const prompt = `
You are a story generation engine. Return only a valid JSON object like this:

{
  "text": "Narrative paragraph here...",
  "choices": ["Choice A", "Choice B"],
  "end": true // only include this if the story is concluding
}

User info:
- Name: ${user.name}
- Genre: ${user.genre}
- Morality score: ${user.morality} (0 = dishonest, 100 = virtuous)

Story so far: ${history.slice(0, -1).join(" → ")}
Last choice: "${history[history.length - 1]}"

Write the next story paragraph and 2–3 choices.

If this is the 15th scene (or the story is logically near an end), return a final paragraph and set "end": true in the JSON.
Do not wrap the JSON in backticks or markdown.
Respond only with the valid JSON object.
`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 500
      })
    });

    const data = await openaiRes.json();
    const content = data?.choices?.[0]?.message?.content;
    const raw = JSON.stringify(data, null, 2);

    if (!content) {
      return res.status(500).json({
        error: "No content returned from GPT",
        raw
      });
    }

    const cleaned = content
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .trim();

    const parsed = JSON.parse(cleaned);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({
      error: err.message || "Unknown error",
      raw: null
    });
  }
}
