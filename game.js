const playerHand = document.getElementById("playerHand");
const dealCardsButton = document.getElementById("dealCardsButton");
const gameResultDisplay = document.createElement("h2");
playerHand.parentNode.insertBefore(gameResultDisplay, playerHand.nextSibling);

const deck = [
  // Убедись, что путь к папке с изображениями правильный
  { name: 'Ace_of_Spades', imageUrl: 'card/Ace_of_Spades.png', power: 22 },
  { name: 'Jack_of_Diamonds', imageUrl: 'card/Jack_of_Diamonds.png', power: 12 },
  { name: 'King_of_Spades', imageUrl: 'card/King_of_Spades.png', power: 18 },
  { name: 'Queen_of_Diamonds', imageUrl: 'card/Queen_of_Diamonds.png', power: 15 },
];

function getRandomCard() {
  const randomIndex = Math.floor(Math.random() * deck.length);
  return deck[randomIndex];
}

function dealCards() {
  playerHand.innerHTML = "";
  gameResultDisplay.textContent = "";

  const playerCard = getRandomCard();
  const computerCard = getRandomCard();

  const playerCardImg = document.createElement("img");
  playerCardImg.src = playerCard.imageUrl;
  playerCardImg.alt = playerCard.name;
  playerCardImg.classList.add("card");

  const computerCardImg = document.createElement("img");
  computerCardImg.src = computerCard.imageUrl;
  computerCardImg.alt = computerCard.name;
  computerCardImg.classList.add("card");

  playerHand.appendChild(playerCardImg);
  
  const computerLabel = document.createElement('h2');
  computerLabel.textContent = 'Motstanderens kort:';
  computerLabel.style.color = 'white';
  playerHand.appendChild(computerLabel);

  playerHand.appendChild(computerCardImg);

  if (playerCard.power > computerCard.power) {
    gameResultDisplay.textContent = "Du vant!";
    gameResultDisplay.style.color = "green";
  } else if (playerCard.power < computerCard.power) {
    gameResultDisplay.textContent = "Datamaskinen vant:";
    gameResultDisplay.style.color = "red";
  } else {
    gameResultDisplay.textContent = "Uavgjort!";
    gameResultDisplay.style.color = "yellow";
  }
}

dealCardsButton.addEventListener("click", dealCards);