const gameTable = document.getElementById("gameTable");
const playerHand = document.getElementById("playerHand");
const computerPlayedCardContainer =
  document.getElementById("computerPlayedCard");
const roundDisplay = document.getElementById("roundDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const roundResultDisplay = document.getElementById("roundResultDisplay");
const startButton = document.getElementById("startButton");
const gameModeSelection = document.getElementById("gameModeSelection");
const singlePlayerButton = document.getElementById("singlePlayerButton");
const computerCardSection = document.getElementById("computerCardSection");
const clickSound = document.getElementById("click-sound");
const playerBonusHand = document.getElementById("playerBonusHand");
const bonustext = document.getElementById("bonus-text");

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

// добавленый новый дек для новых бонусных картd
const bonusDeck = [
  {
    name: "Rocket Ground Air",
    imageUrl: "bonuscard/bonus_skade25.png",
    ability: "bonus_damage",
  },
  {
    name: "Retreat and attack again",
    imageUrl: "bonuscard/return_turn.png",
    ability: "return_turn",
  },
  {
    name: "Conduct Reconnaissance",
    imageUrl: "bonuscard/show_card.png",
    ability: "show_card",
  },
];

let playerHandCards = [];
let computerHandCards = [];
let playerBonusCard = [];
let computerBonusCard = [];
// создаю новые массивы для бонусных карт
let playerScore = 0;
let computerScore = 0;
let currentRound = 1;
let playerPlayedCard = null;
let computerPlayedCard = null;
let playerUsedBonusCard = false;
let computerUsedBonusCard = false;

// на коллоду из 4 карт тут разложено 4 array. котрые нужно увеличить в случае повышения уровней карт
function shuffleDeck(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}



// так же нужно менять потому что значения относяться к коллоде
//добавили сюда какие то копии и создали раздачу из двух коллод
function dealHands() {
  const mainDeckCopy = [...deck];
  const bonusDeckCopy = [...bonusDeck];
  shuffleDeck(mainDeckCopy);
  shuffleDeck(bonusDeckCopy);
  playerHandCards = mainDeckCopy.slice(0, 4);
  computerHandCards = mainDeckCopy.slice(4, 8);
  playerBonusCard = bonusDeckCopy.slice(0, 1);
  computerBonusCard = bonusDeckCopy.slice(1, 2);
}

function useBonusCard(ability) {
  if (ability === "bonus_damage" && !playerUsedBonusCard && playerPlayedCard) {
    const bonusDamage = 25;
    const playerCardWithBonus = {
      ...playerPlayedCard,
      power: playerPlayedCard.power + bonusDamage,
    };
    console.log("не знаю что я тут делаю");
    determineRoundWinner(playerCardWithBonus, computerPlayedCard);
    playerUsedBonusCard = true;

    playerBonusCard.pop(); // Удаляем карту после использования
    renderBonusHand(); // Обновляем отображение руки

    //проверяеться массив на карты и если количенство 0 то тогда выполняеться скрытие текста.

    if (playerBonusCard.length === 0) {
      bonustext.style.display = 'none'; 
 }
}
}

// function deletetextbonuscard(){
//   bonustext.innerHTML = "";
//   const cardElement = document.createElement("div");
//     newGameButton.textContent = "сюда текст";

//   const cardElement = document.createElement("div");
// cardElement.classList.add("card", "bonus-card");
// cardElement.style.backgroundImage = `url(${card.imageUrl})`;
// cardElement.addEventListener("click", () => useBonusCard(card.ability));
// playerBonusHand.appendChild(cardElement);
// computerCardSection.classList.remove("hidden");


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
function renderBonusHand() {
  const playerBonusHand = document.getElementById("playerBonusHand");
  playerBonusHand.innerHTML = "";
  playerBonusCard.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card", "bonus-card");
    // cardElement.textContent = "text inni function renderBonusHand";
    cardElement.style.backgroundImage = `url(${card.imageUrl})`;
    cardElement.addEventListener("click", () => useBonusCard(card.ability));
    playerBonusHand.appendChild(cardElement);
  });
}

function updateGameInfo() {
  roundDisplay.textContent = `ROUND: ${currentRound} / 4`;
  scoreDisplay.textContent = `SCORE: Du ${playerScore} - ${computerScore} Datamaskinen`;
}

function playCard(playerCardIndex) {
  if (playerHandCards.length === 0) return;

  if (clickSound) {
    clickSound.play().catch((error) => {
      console.log("Klikklyden er blokkert.", error);
    });
  }

  playerPlayedCard = playerHandCards[playerCardIndex];
  playerHandCards.splice(playerCardIndex, 1);

  const computerCardIndex = Math.floor(
    Math.random() * computerHandCards.length
  );
  computerPlayedCard = computerHandCards[computerCardIndex];
  computerHandCards.splice(computerCardIndex, 1);
  computerCardSection.classList.remove("hidden");
  renderPlayedCards(playerPlayedCard, computerPlayedCard);

  determineRoundWinner(playerPlayedCard, computerPlayedCard);

  if (currentRound < 4) {
    setTimeout(() => {
      nextRound();
    }, 6000);
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
  playerPlayedCard = null;
  computerPlayedCard = null;
  playerUsedBonusCard = false;
  computerUsedBonusCard = false;

  roundResultDisplay.textContent = "";
  playerHand.innerHTML = "";
  computerPlayedCardContainer.innerHTML = "";
  computerCardSection.classList.add("hidden");
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

  const newGameButton = document.createElement("button");
  newGameButton.textContent = "Start på nytt";
  newGameButton.classList.add("game-button");
  newGameButton.addEventListener("click", () => window.location.reload());
  roundResultDisplay.appendChild(newGameButton);
}

function startGame() {
  playerScore = 0;
  computerScore = 0;
  currentRound = 1;
  playerPlayedCard = null;
  computerPlayedCard = null;
  playerUsedBonusCard = false;
  computerUsedBonusCard = false;
  dealHands();
  renderBonusHand();
  renderPlayerHand();
  updateGameInfo();
  roundResultDisplay.textContent = "";
  computerPlayedCardContainer.innerHTML = "";

  const backgroundMusic = document.getElementById("background-music");
  if (backgroundMusic) {
    // запуск ссылки после определения и переименования.
    // backgroundMusic.play().catch((error) => {  запуск и вызов проверки на ошибки с помощью catch
    //   console.log("Autoavspilling er blokkert.");
    backgroundMusic.play().catch((error) => {
      console.log("Autoavspilling er blokkert.");
    });
  }
}

// скрытие кнопок до момента нажатия на кнопу start и удаление
startButton.addEventListener("click", () => {
  startButton.classList.add("hidden");
  gameModeSelection.classList.remove("hidden");
});

// не особо понятно
singlePlayerButton.addEventListener("click", () => {
  gameModeSelection.classList.add("hidden");
  gameTable.classList.remove("hidden");
  document.body.classList.add("game-active");
  startGame();
});