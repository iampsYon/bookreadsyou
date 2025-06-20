const OPENAI_API_KEY = "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";

async function getGPTScene(user, history) {
  const prompt = `
You are an interactive storytelling engine. The reader is named ${user.name}, who prefers ${user.genre} stories and has a morality score of ${user.morality} (0 = dishonest, 100 = virtuous).

Previous choices: ${history.slice(0, -1).join(" → ")}
Latest choice: "${history[history.length - 1]}"

Write a new paragraph of story that continues from that choice.
Then output 2–3 new decisions the reader can make.

Respond ONLY in this exact JSON format:
{
  "text": "Narrative paragraph here...",
  "choices": ["Choice A", "Choice B", "Choice C"]
}
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 500
    })
  });

  const json = await res.json();
  const text = json.choices?.[0]?.message?.content || "";

  try {
    return JSON.parse(text);
  } catch (e) {
    return {
      text: "⚠️ GPT response was not valid JSON. Here’s the raw output:\n\n" + text,
      choices: ["Try again", "Reset"]
    };
  }
}
