document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const restartButton = document.getElementById('restartButton');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    const snakeHeadColor = 'green';
    const snakeBodyColor = 'yellow'; // Different color for snake body
    const foodColor = 'red';

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameSpeed = 250; // Adjust game speed here (lower is faster)
    let gameInterval;

    function drawSnake() {
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? snakeHeadColor : snakeBodyColor;
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }

    function drawFood() {
        ctx.fillStyle = foodColor;
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreElement.textContent = score;
            generateFood();
        } else {
            snake.pop();
        }
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            generateFood(); // Regenerate if food spawns on the snake
        }
    }

    function checkGameOver() {
        if (snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount || isSnakeCollision()) {
            clearInterval(gameInterval);
            alert('Game Over! Your score: ' + score);
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snakeHighScore', highScore);
                highScoreElement.textContent = highScore;
            }
            resetGame();
        }
    }

    function isSnakeCollision() {
        return snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y);
    }

    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        scoreElement.textContent = score;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        generateFood();
        gameInterval = setInterval(gameLoop, gameSpeed);
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveSnake();
        drawSnake();
        drawFood();
        checkGameOver();
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
        if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
        if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
        if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
    });

    restartButton.addEventListener('click', resetGame);

    drawSnake();
    drawFood();
    gameInterval = setInterval(gameLoop, gameSpeed);
});
