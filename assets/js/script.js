const playBoard = document.querySelector(".play-board");
const ScoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const startButton = document.getElementById("start-button");


let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [[5,5]];
let sentIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;

highScoreElement.innerText = `High Score: ${highScore}`;

//Function to create a random number 1 to 30 for the food position

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;

}

const handleGameOver = () => {
    clearInterval( sentIntervalId );
    alert("Game Over... Press Ok to play again");
    location.reload();

}

//change velocity of snake when key is pressed

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}


controls.forEach(button => button.addEventListener("click", () => changeDirection({key: button.dataset.key })));

const startGame = () => {
    initGame();
    startButton.style.display = "none";
    sentIntervalId = setInterval(updateGameState, 100);
    updateGameState();
};

const initGame = () => {
    updateFoodPosition();
    document.addEventListener("keydown", changeDirection);
    
};




const updateGameState = () => {
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX} / ${foodY + 1} / ${foodX + 1}"></div>`;

    // When snake eats food
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([snakeY, snakeX]);
        score++;
        highScore = score >= highScore ? score : highScore;

        localStorage.setItem("high-score", highScore);

        ScoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeY, snakeX];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][0]} / ${snakeBody[i][1]} / ${snakeBody[i][0] + 1} / ${snakeBody[i][1] + 1}"></div>`;

        if (
            i !== 0 &&
            snakeBody[0][1] === snakeBody[i][1] &&
            snakeBody[0][0] === snakeBody[i][0]
        ) {
            gameOver = true;
        }
    }

    if (gameOver) {
        handleGameOver();
        return;
    }
    
    playBoard.innerHTML = html;
};


startButton.addEventListener("click", startGame);





