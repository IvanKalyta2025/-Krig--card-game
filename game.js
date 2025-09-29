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
let lastRoundOutcome = null;
let nextRoundTimeoutId = null;

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
  if (playerUsedBonusCard) {
    return;
  }

  if (ability === "show_card") {
    if (computerHandCards.length === 0) {
      announceMessage("Det er ingen kort å speide på.");
    } else {
      const revealedCard = computerHandCards.reduce((strongest, current) => {
        return current.power > strongest.power ? current : strongest;
      }, computerHandCards[0]);

      computerCardSection.classList.remove("hidden");
      computerPlayedCardContainer.innerHTML = "";
      const cardElement = document.createElement("div");
      cardElement.classList.add("card", "peek");
      cardElement.style.backgroundImage = `url(${revealedCard.imageUrl})`;
      computerPlayedCardContainer.appendChild(cardElement);

      announceMessage(
        `Speiderkort: Motstanderen har minst ett kort med ${revealedCard.power} skade.`
      );

      setTimeout(() => {
        if (!computerPlayedCard) {
          computerPlayedCardContainer.innerHTML = "";
          computerCardSection.classList.add("hidden");
        }
      }, 2500);
    }

    playerUsedBonusCard = true;
    playerBonusCard.splice(0, 1);
    renderBonusHand();
    return;
  }

  if (ability === "return_turn") {
    if (!playerPlayedCard || !computerPlayedCard || !lastRoundOutcome) {
      announceMessage(
        "Du kan bare bruke tilbaketrekkingskortet etter at kort er spilt."
      );
      return;
    }

    undoOutcome(lastRoundOutcome);
    lastRoundOutcome = null;

    const returnedPlayerCard = { ...playerPlayedCard };
    delete returnedPlayerCard.boosted;
    playerHandCards.push(returnedPlayerCard);
    playerPlayedCard = null;

    computerHandCards.push(computerPlayedCard);
    computerPlayedCard = null;

    if (nextRoundTimeoutId) {
      clearTimeout(nextRoundTimeoutId);
      nextRoundTimeoutId = null;
    }

    roundResultDisplay.className = "";
    announceMessage(
      "Du trakk deg tilbake. Velg et nytt kort for å spille runden på nytt."
    );
    renderPlayerHand();
    computerPlayedCardContainer.innerHTML = "";
    computerCardSection.classList.add("hidden");
    updateGameInfo();

    playerUsedBonusCard = true;
    playerBonusCard.splice(0, 1);
    renderBonusHand();
    return;
  }

  if (!playerPlayedCard || !computerPlayedCard) {
    return;
  }

  if (ability === "bonus_damage") {
    const bonusDamage = 25;
    const previousOutcome = lastRoundOutcome;

    if (previousOutcome) {
      undoOutcome(previousOutcome);
    }

    playerPlayedCard = {
      ...playerPlayedCard,
      power: playerPlayedCard.power + bonusDamage,
      boosted: true,
    };

    renderPlayedCards(playerPlayedCard, computerPlayedCard);

    const newOutcome = compareCards(playerPlayedCard, computerPlayedCard);
    applyOutcome(newOutcome);
    lastRoundOutcome = newOutcome;

    updateRoundResultDisplay(
      newOutcome,
      "Du brukte bonuskortet og økte skaden med 25!"
    );
    updateGameInfo();

    playerUsedBonusCard = true;
    playerBonusCard.splice(0, 1);
    renderBonusHand();
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
  playerBonusHand.innerHTML = "";
  playerBonusCard.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card", "bonus-card");
    cardElement.style.backgroundImage = `url(${card.imageUrl})`;
    cardElement.addEventListener("click", () => useBonusCard(card.ability));
    playerBonusHand.appendChild(cardElement);
  });

  bonustext.style.display = playerBonusCard.length ? "" : "none";
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
    if (nextRoundTimeoutId) {
      clearTimeout(nextRoundTimeoutId);
    }
    nextRoundTimeoutId = setTimeout(() => {
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
  if (playerCard.boosted) {
    playerCardElement.classList.add("boosted");
  }
  playerCardElement.style.backgroundImage = `url(${playerCard.imageUrl})`;
  playerHand.appendChild(playerCardElement);

  const computerCardElement = document.createElement("div");
  computerCardElement.classList.add("card", "played");
  computerCardElement.style.backgroundImage = `url(${computerCard.imageUrl})`;
  computerPlayedCardContainer.appendChild(computerCardElement);
}

function compareCards(playerCard, computerCard) {
  if (!playerCard || !computerCard) {
    return null;
  }
  if (playerCard.power > computerCard.power) {
    return "player";
  }
  if (playerCard.power < computerCard.power) {
    return "computer";
  }
  return "draw";
}

function applyOutcome(outcome) {
  if (outcome === "player") {
    playerScore++;
  } else if (outcome === "computer") {
    computerScore++;
  }
}

function undoOutcome(outcome) {
  if (outcome === "player" && playerScore > 0) {
    playerScore--;
  } else if (outcome === "computer" && computerScore > 0) {
    computerScore--;
  }
}

function updateRoundResultDisplay(outcome, customMessage = "") {
  let message = "";
  let className = "";

  if (outcome === "player") {
    message = "Du vant runden!";
    className = "win";
  } else if (outcome === "computer") {
    message = "Datamaskinen vant runden!";
    className = "lose";
  } else if (outcome === "draw") {
    message = "Uavgjort!";
    className = "draw";
  }

  if (customMessage) {
    message = `${message} ${customMessage}`.trim();
  }

  roundResultDisplay.textContent = message;
  roundResultDisplay.className = className;
}

function announceMessage(message) {
  roundResultDisplay.textContent = message;
  roundResultDisplay.className = "";
}

function determineRoundWinner(playerCard, computerCard) {
  const outcome = compareCards(playerCard, computerCard);
  if (!outcome) {
    return;
  }

  applyOutcome(outcome);
  lastRoundOutcome = outcome;
  updateRoundResultDisplay(outcome);
  updateGameInfo();
}

function nextRound() {
  if (nextRoundTimeoutId) {
    clearTimeout(nextRoundTimeoutId);
    nextRoundTimeoutId = null;
  }

  currentRound++;
  playerPlayedCard = null;
  computerPlayedCard = null;
  playerUsedBonusCard = false;
  computerUsedBonusCard = false;
  lastRoundOutcome = null;

  roundResultDisplay.textContent = "";
  roundResultDisplay.className = "";
  playerHand.innerHTML = "";
  computerPlayedCardContainer.innerHTML = "";
  computerCardSection.classList.add("hidden");
  updateGameInfo();
  renderPlayerHand();
}

function endGame() {
  if (nextRoundTimeoutId) {
    clearTimeout(nextRoundTimeoutId);
    nextRoundTimeoutId = null;
  }

  let finalMessage = "";
  if (playerScore > computerScore) {
    finalMessage = `Spillet er over! Du vant med poengsummen ${playerScore} - ${computerScore}!`;
  } else if (playerScore < computerScore) {
    finalMessage = `Spillet er over! Du tapte med poengsummen ${playerScore} - ${computerScore}.`;
  } else {
    finalMessage = `Spillet er over! Uavgjort med poengsummen ${playerScore} - ${computerScore}.`;
  }
  roundResultDisplay.className = "";
  roundResultDisplay.textContent = finalMessage;

  const newGameButton = document.createElement("button");
  newGameButton.textContent = "Start på nytt";
  newGameButton.classList.add("game-button");
  newGameButton.addEventListener("click", () => window.location.reload());
  roundResultDisplay.appendChild(newGameButton);
}

function startGame() {
  if (nextRoundTimeoutId) {
    clearTimeout(nextRoundTimeoutId);
    nextRoundTimeoutId = null;
  }

  playerScore = 0;
  computerScore = 0;
  currentRound = 1;
  playerPlayedCard = null;
  computerPlayedCard = null;
  playerUsedBonusCard = false;
  computerUsedBonusCard = false;
  lastRoundOutcome = null;
  dealHands();
  renderBonusHand();
  renderPlayerHand();
  updateGameInfo();
  roundResultDisplay.textContent = "";
  roundResultDisplay.className = "";
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
