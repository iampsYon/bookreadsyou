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
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 500
      })
    });

    const json = await res.json();

    const content = json?.choices?.[0]?.message?.content;
    const raw = JSON.stringify(json, null, 2);

    if (!content) {
      return {
        text: `❌ GPT did not return any message content.

--- BEGIN RAW JSON ---
${raw}
--- END RAW JSON ---`,
        choices: ["Try again", "Reset"]
      };
    }

    const cleaned = content.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();

    return JSON.parse(cleaned);

  } catch (err) {
    return {
      text: `❌ ERROR: ${err.message || "Unknown error"}
`,
      choices: ["Try again", "Reset"]
    };
  }
}
