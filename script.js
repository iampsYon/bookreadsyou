let user = {};
let history = [];

async function startStory() {
  user.name = document.getElementById('name').value || "Stranger";
  user.genre = document.getElementById('genre').value;
  user.morality = document.getElementById('morality').value;

  document.getElementById('user-form').style.display = 'none';
  document.getElementById('story-container').style.display = 'block';

  history = []; // reset
  await nextScene("BEGIN");
}

async function nextScene(userChoice) {
  history.push(userChoice);
  const response = await getGPTScene(user, history);

  const storyText = document.getElementById('story-text');
  const choicesDiv = document.getElementById('choices');

  storyText.innerText = response.text || "⚠️ No story text returned.";
  choicesDiv.innerHTML = "";

  if (response.end) {
    const endLabel = document.createElement("p");
    endLabel.innerHTML = "<strong>THE END</strong>";
    choicesDiv.appendChild(endLabel);

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Start Over";
    restartBtn.onclick = () => {
      document.getElementById('story-container').style.display = 'none';
      document.getElementById('user-form').style.display = 'block';
      document.getElementById('story-text').innerText = "";
      document.getElementById('choices').innerHTML = "";
    };
    choicesDiv.appendChild(restartBtn);

  } else if (Array.isArray(response.choices)) {
    response.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.onclick = () => nextScene(choice);
      choicesDiv.appendChild(btn);
    });
  } else {
    choicesDiv.innerHTML = "<p>⚠️ No choices returned.</p>";
  }
}
