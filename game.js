const plyerHand = document.getElementById ("playerHand");
const dealCardsButton = document.getElementById("dealCardsButton");
const gameResultDisplay = document.createElement ("h2");
plyerHand.parentNode.insertBefore(gameResultDisplay,plyerHand,nextSibling);


const deck = [
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
    gemeResultDisplay.textXontent = "";
}

const playerCard = getRandomCard();
const computerCard = getRandomCard();

const playerCardImg = document.createElement("img");
computerCardImg.src = computerCard.imageUrl;
playerCardImg.alt = playerCard.name;
playerCardImg.classList.add("card");

const computerCardCardImg = document.createElement("h2");
computerCardImg.src = computerCard.imageUrl;
playerCardImg.alt = playerCard.name;
playerCardImg.classList.add("card");

playerHand.appendChild(playerCardImg);


if (playerCard.power > computerCard.power){
    gameResultDisplay.textContent = "Du vant!";
    gameResultDisplay.style.colo = "green";
} else if (playerCard.power < computerCard.power){
    gemeResultDisplay.textContent = "Datamaskinen vant:";
    gameResultDisplay.style.color = "red";
} else  {
    gameResultDisplay.textContent = "Uavgjørt!";
    gameResultDisplay.style.color = "yellow";
}

dealCardsButton.addEventListener ("click", dealCards);