const OPENAI_API_KEY = "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";

async function getGPTScene(user, history) {
  const prompt = `
You are a story generation engine. Return only a valid JSON object like this:

{
  "text": "Narrative paragraph here...",
  "choices": ["Choice A", "Choice B", "Choice C"]
}

User info:
- Name: ${user.name}
- Genre: ${user.genre}
- Morality score: ${user.morality} (0 = dishonest, 100 = virtuous)

Story so far: ${history.slice(0, -1).join(" → ")}
Last choice: "${history[history.length - 1]}"

Continue the story with one paragraph, then give 2–3 next choices.
Output only valid JSON. No explanation or commentary.
`;

  try {
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

    // Debug log the full raw response
    return {
      text: `🔍 Full OpenAI response:\n\n${JSON.stringify(json, null, 2)}`,
      choices: ["Try again", "Reset"]
    };

  } catch (err) {
    return {
      text: `❌ ERROR: ${err.message || "Unknown error"}`,
      choices: ["Try again", "Reset"]
    };
  }
}