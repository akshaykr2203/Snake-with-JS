const board = document.querySelector('.board');
const blockHeight = 50;
const blockWidth = 50;
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const startBtn = document.querySelector('.st-btn');
const restartBtn = document.querySelector('.end-btn');
const modal = document.querySelector('.modal');
const startGame = document.querySelector('.start-game');
const gameOver = document.querySelector('.game-over');

const currentscore = document.querySelector('#score');
const currenthighScore = document.querySelector('#highScore');
const currenttime = document.querySelector('#time');
let intervalId = null;
let timerIntervalId = null;

let direction = 'right';
let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
};
let head = null;
let blocks = [];
let time = `00-00`;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
currenthighScore.innerText = highScore;






for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const block = document.createElement('div');
        block.classList.add('box');
        board.appendChild(block);
        blocks[`${i}-${j}`] = block;
    }
}


let snake = [
    {
        x: 1, y: 5
    }
];




function forDirection() {
    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    }
    else if (direction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    }
    else if (direction === 'up') {
        head = { x: snake[0].x - 1, y: snake[0].y };
    }
    else if (direction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }
}


function generateFood() {
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        }
        blocks[`${food.x}-${food.y}`].classList.add('food');
        snake.unshift(head);
        score++;
        currentscore.innerText = score;
        if (score > highScore) {
            highScore = score;
            currenthighScore.innerText = highScore;
            localStorage.setItem('highScore', highScore.toString());
        }
    }
}


function checkCollision() {
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        modal.style.display = 'flex';
        startGame.style.display = 'none';
        gameOver.style.display = 'flex';
        clearInterval(intervalId);
        return true;
    }
    return false;
}

function resetGame() {
    // 1. Purane Snake aur Food ke DOM classes clear karein
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });

    blocks[`${food.x}-${food.y}`].classList.remove('food');


    // 2. Snake, Direction aur Food ki initial positions reset karein
    snake = [{ x: 1, y: 5 }];
    direction = 'right';
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };
    score = 0;
    time = `00-00`;
    // clearInterval(intervalId);
    // clearInterval(timerIntervalId);
    currentscore.innerText = score;
    intervalId = setInterval(() => {
        renderSnake();
    }, 400);
}




function renderSnake() {
    forDirection();
    if (checkCollision()) {
        return;
    }
    generateFood();
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });
    snake.unshift(head);
    snake.pop();

    blocks[`${food.x}-${food.y}`].classList.add('food');

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    })
}




startBtn.addEventListener('click', () => {
    startGame.style.display = 'none';
    modal.style.display = 'none';
    intervalId = setInterval(() => { renderSnake(); }, 400)
    timerIntervalId = setInterval(() => {
        let [minutes, seconds] = time.split('-').map(Number);
        seconds++;
        if (seconds === 59) {
            seconds = 0;
            minutes++;
        }
        time = `${minutes}-${seconds}`;
        currenttime.innerText = time;
    }, 1000)
});


restartBtn.addEventListener('click', () => {
    resetGame();
    gameOver.style.display = 'none';
    modal.style.display = 'none';
})



addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        console.log(e.key);
        direction = 'left';
    }
    else if (e.key === 'ArrowRight') {
        direction = 'right';
    }
    else if (e.key === 'ArrowUp') {
        direction = 'up';
    }
    else if (e.key === 'ArrowDown') {
        direction = 'down';
    }
})

