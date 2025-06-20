const OPENAI_API_KEY = "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";

async function getGPTScene(user, history) {
  const prompt = `
The reader is named ${user.name}, who prefers ${user.genre} stories and has a moral alignment score of ${user.morality} (0 = dishonest, 100 = virtuous).
Story so far: ${history.slice(0, -1).join(" -> ")}
User just chose: "${history[history.length - 1]}"

Generate a short paragraph of what happens next. End with 2–3 choices.

Respond in JSON like:
{
  "text": "Story paragraph here...",
  "choices": ["Option 1", "Option 2", "Option 3"]
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
      text: "Something went wrong parsing the AI response. Here's the raw output:\n\n" + text,
      choices: ["Try again", "Reset story"]
    };
  }
}