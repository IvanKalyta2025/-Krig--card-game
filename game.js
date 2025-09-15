const gameTable = document.getElementById("gameTable");
const playerHand = document.getElementById("playerHand");
const computerPlayedCardContainer = document.getElementById("computerPlayedCard");
const roundDisplay = document.getElementById("roundDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const roundResultDisplay = document.getElementById("roundResultDisplay");
const nextRoundButton = document.getElementById("nextRoundButton");
const startButton = document.getElementById("startButton");
const gameModeSelection = document.getElementById("gameModeSelection");
const singlePlayerButton = document.getElementById("singlePlayerButton");
const computerCardSection = document.getElementById("computerCardSection");

const deck = [
  { name: "HOVEDKAMPVOGN", imageUrl: "card/12skade.png", power: 12 },
  { name: "FLYTENDE ANGREPSFARTØY", imageUrl: "card/22skade.png", power: 22 },
  { name: "KAMPTANK", imageUrl: "card/18skade.png", power: 18 },
  { name: "INFANTERI", imageUrl: "card/15skade.png", power: 15 },
  { name: "SKADE-27", imageUrl: "card/27skade.png", power: 27 },
  { name: "SKADE-37", imageUrl: "card/37skade.png", power: 37 },
  { name: "SKADE-42", imageUrl: "card/42skade.png", power: 42 },
  { name: "SKADE-58", imageUrl: "card/58skade.png", power: 58 },
];

let playerHandCards = [];
let computerHandCards = [];
let playerScore = 0;
let computerScore = 0;
let currentRound = 1;

function shuffleDeck(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function dealHands() {
  shuffleDeck(deck);
  playerHandCards = deck.slice(0, 4);
  computerHandCards = deck.slice(4, 8);
}

function renderPlayerHand() {
  playerHand.innerHTML = "";
  playerHandCards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.style.backgroundImage = `url(${card.imageUrl})`;
    cardElement.dataset.index = index;
    cardElement.addEventListener("click", () => playCard(index));
    playerHand.appendChild(cardElement);
  });
}

function updateGameInfo() {
  roundDisplay.textContent = `Раунд: ${currentRound} / 4`;
  scoreDisplay.textContent = `Счет: Du ${playerScore} - ${computerScore} Datamaskinen`;
}

function playCard(playerCardIndex) {
  if (playerHandCards.length === 0) return;

  const playerCard = playerHandCards[playerCardIndex];
  playerHandCards.splice(playerCardIndex, 1);

  const computerCardIndex = Math.floor(
    Math.random() * computerHandCards.length
  );
  const computerCard = computerHandCards[computerCardIndex];
  computerHandCards.splice(computerCardIndex, 1);
  computerCardSection.classList.remove("hidden");
  renderPlayedCards(playerCard, computerCard);

  determineRoundWinner(playerCard, computerCard);

  if (currentRound < 4) {
    nextRoundButton.classList.remove("hidden");
  } else {
    endGame();
  }
}

function renderPlayedCards(playerCard, computerCard) {
  playerHand.innerHTML = "";
  computerPlayedCardContainer.innerHTML = "";

  const playerCardElement = document.createElement("div");
  playerCardElement.classList.add("card", "played");
  playerCardElement.style.backgroundImage = `url(${playerCard.imageUrl})`;
  playerHand.appendChild(playerCardElement);

  const computerCardElement = document.createElement("div");
  computerCardElement.classList.add("card", "played");
  computerCardElement.style.backgroundImage = `url(${computerCard.imageUrl})`;
  computerPlayedCardContainer.appendChild(computerCardElement);
}

function determineRoundWinner(playerCard, computerCard) {
  if (playerCard.power > computerCard.power) {
    playerScore++;
    roundResultDisplay.textContent = "Du vant runden!";
    roundResultDisplay.className = "win";
  } else if (playerCard.power < computerCard.power) {
    computerScore++;
    roundResultDisplay.textContent = "Datamaskinen vant runden!";
    roundResultDisplay.className = "lose";
  } else {
    roundResultDisplay.textContent = "Uavgjort!";
    roundResultDisplay.className = "draw";
  }
  updateGameInfo();
}

function nextRound() {
  currentRound++;
  roundResultDisplay.textContent = "";

  playerHand.innerHTML = "";
  computerPlayedCardContainer.innerHTML = "";
  computerCardSection.classList.add("hidden");
  nextRoundButton.classList.add("hidden");
  updateGameInfo();
  renderPlayerHand();
}

function endGame() {
  let finalMessage = "";
  if (playerScore > computerScore) {
    finalMessage = `Spillet er over! Du vant med poengsummen ${playerScore} - ${computerScore}!`;
  } else if (playerScore < computerScore) {
    finalMessage = `Spillet er over! Du tapte med poengsummen ${playerScore} - ${computerScore}.`;
  } else {
    finalMessage = `Spillet er over! Uavgjort med poengsummen ${playerScore} - ${computerScore}.`;
  }
  roundResultDisplay.textContent = finalMessage;
  nextRoundButton.textContent = "Start på nytt";
  nextRoundButton.removeEventListener("click", nextRound);
  nextRoundButton.addEventListener("click", () => {
    window.location.reload();
  });
  nextRoundButton.classList.remove("hidden");
}

function startGame() {
  playerScore = 0;
  computerScore = 0;
  currentRound = 1;
  dealHands();
  renderPlayerHand();
  updateGameInfo();
  nextRoundButton.classList.add("hidden");
  roundResultDisplay.textContent = "";
  computerPlayedCardContainer.innerHTML = "";


  const backgroundMusic = document.getElementById("background-music");
  if (backgroundMusic) {
    backgroundMusic.play().catch((error) => {
      console.log("Автоматическое воспроизведение заблокировано.");
    });
  }
}

startButton.addEventListener("click", () => {
  startButton.classList.add("hidden");
  gameModeSelection.classList.remove("hidden");
});

singlePlayerButton.addEventListener("click", () => {
  gameModeSelection.classList.add("hidden");
  gameTable.classList.remove("hidden");
  document.body.classList.add("game-active");
  startGame();
});

nextRoundButton.addEventListener("click", nextRound);