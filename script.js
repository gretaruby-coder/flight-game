const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const highScoreEl = document.getElementById("highScore");
const message = document.getElementById("message");

let width;
let height;
let gameRunning = false;
let score = 0;
let lives = 3;
let highScore = Number(localStorage.getItem("skyAceHighScore")) || 0;

const keys = {};

const player = {
    x: 0,
    y: 0,
    width: 50,
    height: 65,
    speed: 6
};

let bullets = [];
let enemies = [];
let stars = [];
let clouds = [];

let enemyTimer = 0;
let starTimer = 0;
let cloudTimer = 0;
let lastTime = 0;

highScoreEl.textContent = highScore;


// --------------------
// RESIZE GAME
// --------------------

function resizeCanvas() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    if (!gameRunning) {
        player.x = width / 2;
        player.y = height - 100;
    }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// --------------------
// KEYBOARD CONTROLS
// --------------------

document.addEventListener("keydown", function(event) {

    keys[event.key.toLowerCase()] = true;

    if (event.code === "Space") {
        event.preventDefault();

        if (!gameRunning) {
            startGame();
        } else {
            shoot();
        }
    }
});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});


// --------------------
// START GAME
// --------------------

document.getElementById("startBtn").addEventListener("click", startGame);

function startGame() {

    gameRunning = true;

    score = 0;
    lives = 3;

    bullets = [];
    enemies = [];
    stars = [];
    clouds = [];

    enemyTimer = 0;
    starTimer = 0;
    cloudTimer = 0;

    player.x = width / 2;
    player.y = height - 100;

    message.classList.add("hidden");

    updateHUD();

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);
}


// --------------------
// GAME OVER
// --------------------

function gameOver() {

    gameRunning = false;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("skyAceHighScore", highScore);
    }

    highScoreEl.textContent = highScore;

    message.innerHTML = `
        <h1>GAME OVER</h1>
        <p>Score: ${score}</p>
        <p>High Score: ${highScore}</p>
        <button id="restartBtn">FLY AGAIN</button>
    `;

    message.classList.remove("hidden");

    document
        .getElementById("restartBtn")
        .addEventListener("click", startGame);
}


// --------------------
// PLAYER MOVEMENT
// --------------------

function movePlayer() {

    if (keys["arrowleft"] || keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["arrowright"] || keys["d"]) {
        player.x += player.speed;
    }

    if (keys["arrowup"] || keys["w"]) {
        player.y -= player.speed;
    }

    if (keys["arrowdown"] || keys["s"]) {
        player.y += player.speed;
    }

    // Keep plane inside screen

    player.x = Math.max(
        player.width / 2,
        Math.min(width - player.width / 2, player.x)
    );

    player.y = Math.max(
        player.height / 2,
        Math.min(height - player.height / 2, player.y)
    );
}


// --------------------
// SHOOT
// --------------------

function shoot() {

    bullets.push({
        x: player.x,
        y: player.y - 35,
        width: 5,
        height: 18,
        speed: 10
    });
}


// --------------------
// CREATE ENEMY
// --------------------

function createEnemy() {

    enemies.push({
        x: 30 + Math.random() * (width - 60),
        y: -60,
        width: 45,
        height: 60,
        speed: 2 + Math.random() * 2
    });
}


// --------------------
// CREATE STAR
// --------------------

function createStar() {

    stars.push({
        x: 20 + Math.random() * (width - 40),
        y: -20,
        size: 12,
        speed: 2
    });
}


// --------------------
// CREATE CLOUD
// --------------------

function createCloud() {

    clouds.push({
        x: Math.random() * width,
        y: -50,
        size: 20 + Math.random() * 35,
        speed: 0.5 + Math.random()
    });
}


// --------------------
// COLLISION
// --------------------

function collision(a, b) {

    return (
        Math.abs(a.x - b.x) <
        (a.width + b.width) / 2

        &&

        Math.abs(a.y - b.y) <
        (a.height + b.height) / 2
    );
}


// --------------------
// UPDATE GAME
// --------------------

function update() {

    movePlayer();


    // Bullets

    bullets.forEach(bullet => {
        bullet.y -= bullet.speed;
    });

    bullets = bullets.filter(
        bullet => bullet.y > -30
    );


    // Enemies

    enemies.forEach(enemy => {
        enemy.y += enemy.speed;
    });


    // Stars

    stars.forEach(star => {
        star.y += star.speed;
    });


    // Clouds

    clouds.forEach(cloud => {
        cloud.y += cloud.speed;
    });


    // Enemy spawning

    enemyTimer--;

    if (enemyTimer <= 0) {

        createEnemy();

        enemyTimer = 70;
    }


    // Star spawning

    starTimer--;

    if (starTimer <= 0) {

        createStar();

        starTimer = 120;
    }


    // Cloud spawning

    cloudTimer--;

    if (cloudTimer <= 0) {

        createCloud();

        cloudTimer = 50;
    }


    // Bullet hitting enemy

    for (let i = enemies.length - 1; i >= 0; i--) {

        for (let j = bullets.length - 1; j >= 0; j--) {

            if (collision(enemies[i], bullets[j])) {

                enemies.splice(i, 1);
                bullets.splice(j, 1);

                score += 100;

                break;
            }
        }
    }


    // Enemy hitting player

    for (let i = enemies.length - 1; i >= 0; i--) {

        if (collision(player, enemies[i])) {

            enemies.splice(i, 1);

            lives--;

            updateHUD();

            if (lives <= 0) {
                gameOver();
                return;
            }
        }
    }


    // Collect stars

    for (let i = stars.length - 1; i >= 0; i--) {

        const distance = Math.hypot(
            player.x - stars[i].x,
            player.y - stars[i].y
        );

        if (distance < 35) {

            stars.splice(i, 1);

            score += 250;
        }
    }


    // Remove objects outside screen

    enemies = enemies.filter(
        enemy => enemy.y < height + 80
    );

    stars = stars.filter(
        star => star.y < height + 40
    );

    clouds = clouds.filter(
        cloud => cloud.y < height + 100
    );


    // Survival score

    score += 1;

    updateHUD();
}


// --------------------
// DRAW SKY
// --------------------

function drawBackground() {

    const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        height
    );

    gradient.addColorStop(0, "#4fc3f7");
    gradient.addColorStop(1, "#d8f5ff");

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );
}


// --------------------
// DRAW PLAYER
// --------------------

function drawPlayer() {

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );

    // Wings

    ctx.fillStyle = "#e8e8e8";

    ctx.beginPath();

    ctx.moveTo(0, -32);
    ctx.lineTo(10, 0);
    ctx.lineTo(35, 22);
    ctx.lineTo(28, 27);
    ctx.lineTo(5, 14);

    ctx.lineTo(0, 32);

    ctx.lineTo(-5, 14);
    ctx.lineTo(-28, 27);
    ctx.lineTo(-35, 22);
    ctx.lineTo(-10, 0);

    ctx.closePath();

    ctx.fill();


    // Body

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        8,
        34,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Cockpit

    ctx.fillStyle = "#42a5f5";

    ctx.beginPath();

    ctx.ellipse(
        0,
        -13,
        5,
        9,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();
}


// --------------------
// DRAW ENEMY
// --------------------

function drawEnemy(enemy) {

    ctx.save();

    ctx.translate(
        enemy.x,
        enemy.y
    );

    ctx.fillStyle = "#e53935";

    ctx.beginPath();

    ctx.moveTo(0, 30);
    ctx.lineTo(10, 5);
    ctx.lineTo(30, -20);
    ctx.lineTo(24, -27);
    ctx.lineTo(7, -10);
    ctx.lineTo(0, -32);
    ctx.lineTo(-7, -10);
    ctx.lineTo(-24, -27);
    ctx.lineTo(-30, -20);
    ctx.lineTo(-10, 5);

    ctx.closePath();

    ctx.fill();

    ctx.restore();
}


// --------------------
// DRAW STAR
// --------------------

function drawStar(star) {

    ctx.save();

    ctx.translate(
        star.x,
        star.y
    );

    ctx.fillStyle = "#ffd740";

    ctx.beginPath();

    for (let i = 0; i < 10; i++) {

        const radius =
            i % 2 === 0
                ? star.size
                : star.size / 2;

        const angle =
            i * Math.PI / 5;

        const x =
            Math.cos(angle) * radius;

        const y =
            Math.sin(angle) * radius;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();

    ctx.fill();

    ctx.restore();
}


// --------------------
// DRAW CLOUD
// --------------------

function drawCloud(cloud) {

    ctx.fillStyle = "rgba(255,255,255,0.65)";

    ctx.beginPath();

    ctx.arc(
        cloud.x,
        cloud.y,
        cloud.size,
        0,
        Math.PI * 2
    );

    ctx.arc(
        cloud.x + cloud.size,
        cloud.y + 5,
        cloud.size * .7,
        0,
        Math.PI * 2
    );

    ctx.arc(
        cloud.x - cloud.size,
        cloud.y + 7,
        cloud.size * .65,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// --------------------
// DRAW EVERYTHING
// --------------------

function draw() {

    drawBackground();

    clouds.forEach(drawCloud);

    stars.forEach(drawStar);


    // Bullets

    ctx.fillStyle = "#ffeb3b";

    bullets.forEach(bullet => {

        ctx.fillRect(
            bullet.x - 2,
            bullet.y,
            bullet.width,
            bullet.height
        );
    });


    enemies.forEach(drawEnemy);

    drawPlayer();
}


// --------------------
// HUD
// --------------------

function updateHUD() {

    scoreEl.textContent = score;
    livesEl.textContent = lives;
    highScoreEl.textContent = highScore;
}


// --------------------
// MAIN GAME LOOP
// --------------------

function gameLoop(time) {

    if (!gameRunning) {
        return;
    }

    update();
    draw();

    requestAnimationFrame(gameLoop);
}


// Initial screen

draw();
