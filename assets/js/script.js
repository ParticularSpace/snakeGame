const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const startButton = document.querySelector(".start-btn");
const countdownElement = document.querySelector(".countdown");


let gameOver = false;
let foodX, foodY;
let snakeX = 15, snakeY = 15;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

const startGame = () => {
    countdownElement.style.display = "block";
    countdown(3);
};

// Get high score from local storage

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Pass a random between 1 and 40 as food position


const createFoodPosition = () => {
    return {
        x: Math.floor(Math.random() * 50) + 1,
        y: Math.floor(Math.random() * 30) + 1
    };
};

const foodPositions = Array.from({ length: 5 }, createFoodPosition);

const countdown = (time) => {
    countdownElement.innerText = time;
    if (time === 0) {
        countdownElement.style.display = "none";
        setIntervalId = setInterval(initGame, 100);
    } else {
        setTimeout(() => countdown(time - 1), 1000);
    }
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    playBoard.innerHTML = `
        <div class="game-over">
            <h2>Game Over!</h2>
            <button class="retry-btn">Retry</button>
        </div>`;
    const retryButton = document.querySelector(".retry-btn");
    retryButton.addEventListener("click", () => location.reload());
};

// Change velocity value based on key press

const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Change Direction on each key click

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = "";

    // Render multiple food items
    for (const food of foodPositions) {
        html += `<div class="food" style="grid-area: ${food.y} / ${food.x}"></div>`;
    }

    // When snake eats food
    foodPositions.forEach((food, index) => {
        if (snakeX === food.x && snakeY === food.y) {
            // Update the eaten food position
foodPositions[index] = createFoodPosition();

            snakeBody.push([food.y, food.x]); // Add food to snake body array
            score++;
            highScore = score >= highScore ? score : highScore; // if score > high score => high score = score

            localStorage.setItem("high-score", highScore);
            scoreElement.innerText = `Score: ${score}`;
            highScoreElement.innerText = `High Score: ${highScore}`;
        }
    });

    // Update Snake Head
    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    // Check snake body is out of wall or no
    if (snakeX <= 0 || snakeX > 50 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    // Add div for each part of snake body
    for (let i = 0; i < snakeBody.length; i++) {
        const snakePartClass = i === 0 ? "snake-head" : "head";
        html += `<div class="${snakePartClass}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Check snake head hit body or no
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = html;
}


startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    countdown(3);
});

document.addEventListener("keyup", changeDirection);