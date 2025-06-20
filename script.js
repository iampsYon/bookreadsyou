let user = {};
let history = [];

async function startStory() {
  user.name = document.getElementById('name').value || "Stranger";
  user.genre = document.getElementById('genre').value;
  user.morality = document.getElementById('morality').value;

  document.getElementById('user-form').style.display = 'none';
  document.getElementById('story-container').style.display = 'block';

  await nextScene("BEGIN");
}

async function nextScene(userChoice) {
  history.push(userChoice);
  const response = await getGPTScene(user, history);
  document.getElementById('story-text').innerText = response.text;

  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = "";
  response.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => nextScene(choice);
    choicesDiv.appendChild(btn);
  });
}