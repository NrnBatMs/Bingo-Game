const wordPairs = [
  ["walk", "walked"], ["run", "ran"], ["eat", "ate"], ["sleep", "slept"],
  ["write", "wrote"], ["read", "read"], ["sing", "sang"], ["dance", "danced"],
  ["jump", "jumped"], ["swim", "swam"], ["speak", "spoke"], ["drive", "drove"]
];

let flipped = [], matchedPairs = 0, totalPairs = 12;
let time = 300, timer;
let teamName = "";

document.getElementById("startGame").onclick = startGame;
document.getElementById("endGame").onclick = () => endGame(false);

function startGame() {
  teamName = document.getElementById("teamName").value.trim();
  if (!teamName) return alert("Enter team name!");

  document.getElementById("registration").classList.add("hidden");
  document.getElementById("gameBoard").classList.remove("hidden");
  document.getElementById("currentTeam").textContent = `Team: ${teamName}`;
  
  matchedPairs = 0;
  flipped = [];
  time = 300;
  document.getElementById("timer").textContent = "Time: 5:00";

  createBoard();
  timer = setInterval(updateTimer, 1000);
}

function createBoard() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  
  let words = wordPairs.flat();
  words.push("FREE");
  words = shuffle(words).slice(0, 25);

  words.forEach(word => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = word === "FREE" ? "FREE" : "";
    if (word !== "FREE") {
      cell.onclick = () => flipCard(cell, word);
    } else {
      cell.classList.add("matched");
    }
    grid.appendChild(cell);
  });
}

function flipCard(cell, word) {
  if (cell.classList.contains("matched") || flipped.length === 2) return;

  cell.textContent = word;
  flipped.push({ cell, word });

  if (flipped.length === 2) {
    setTimeout(checkMatch, 600);
  }
}

function checkMatch() {
  const [a, b] = flipped;
  const isPair = wordPairs.some(pair => (pair.includes(a.word) && pair.includes(b.word) && a.word !== b.word));
  if (isPair) {
    a.cell.classList.add("matched");
    b.cell.classList.add("matched");
    matchedPairs++;
    if (matchedPairs === totalPairs) endGame(true);
  } else {
    a.cell.textContent = "";
    b.cell.textContent = "";
  }
  flipped = [];
}

function updateTimer() {
  time--;
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  document.getElementById("timer").textContent = `Time: ${mins}:${secs < 10 ? "0" : ""}${secs}`;
  if (time === 0) endGame(false);
}

function endGame(win) {
  clearInterval(timer);
  saveScore(teamName, matchedPairs, 300 - time);
  showScoreboard();
}

function saveScore(name, pairs, elapsed) {
  const scores = JSON.parse(localStorage.getItem("bingoScores")) || [];
  scores.push({ name, pairs, time: elapsed });
  scores.sort((a, b) => b.pairs - a.pairs || a.time - b.time);
  localStorage.setItem("bingoScores", JSON.stringify(scores));
}

function showScoreboard() {
  const scores = JSON.parse(localStorage.getItem("bingoScores")) || [];
  const table = document.getElementById("scoreTable");
  table.innerHTML = "";
  scores.forEach((s, i) => {
    const row = `<tr>
      <td>${i + 1}</td>
      <td>${s.name}</td>
      <td>${s.pairs}</td>
      <td>${Math.floor(s.time / 60)}:${(s.time % 60).toString().padStart(2, "0")}</td>
    </tr>`;
    table.innerHTML += row;
  });

  document.getElementById("gameBoard").classList.add("hidden");
  document.getElementById("registration").classList.remove("hidden");
  document.getElementById("teamName").value = "";
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
