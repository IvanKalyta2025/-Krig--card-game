const startButton = document.getElementById("startButton");
const gameModeSelection = document.getElementById ("gameModeSelection");


startButton.addEventListener("click", () =>{
    startButton.style.display = "none";
    gameModeSelection.style.display = "block";
});

const singlePlayerButton = document.getElementById("singlePlayerButton");
const gamleTable = document.getElementById("gameTable");

singlePlayerButton.addEventListener("click", ()=> {
    gameModeSelection.classList.add("hidden");
    gamleTable.classList.remove("hidden");
    document.body.classList.add("game-active")
});




// // Находим наши кнопки и контейнер в HTML
// const startButton = document.getElementById('startButton');
// const gameModeSelection = document.getElementById('gameModeSelection');

// // Добавляем "слушателя" события клика на кнопку "Nytt spill"
// startButton.addEventListener('click', () => {
//     // Скрываем кнопку "Nytt spill"
//     startButton.classList.add('hidden');
    
//     // Показываем блок с выбором режимов игры
//     gameModeSelection.classList.remove('hidden');
// });