async function getGPTScene(user, history) {
  try {
    const res = await fetch("/api/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user, history })
    });

    const json = await res.json();

    if (json.error) {
      return {
        text: `❌ GPT error: ${json.error}`,
        choices: ["Try again", "Reset"]
      };
    }

    return json;

  } catch (err) {
    return {
      text: `❌ Network error: ${err.message || "Unknown error"}`,
      choices: ["Try again", "Reset"]
    };
  }
}
