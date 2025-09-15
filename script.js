const startButton = document.getElementById("startButton");
const gameModeSelection = document.getElementById("gameModeSelection");

startButton.addEventListener("click", () => {
  startButton.classList.add("hidden");
  gameModeSelection.classList.remove("hidden");
});

const singlePlayerButton = document.getElementById("singlePlayerButton");
const gameTable = document.getElementById("gameTable");

singlePlayerButton.addEventListener("click", () => {
  gameModeSelection.classList.add("hidden");
  gameTable.classList.remove("hidden");
  document.body.classList.add("game-active");
});
