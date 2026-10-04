const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const message = document.getElementById("message");

let width;
let height;

let gameRunning = false;
let crashed = false;

const keys = {};

let selectedPlane = "emirates";

const planes = {
    emirates: {
        name: "Emirates",
        color: "#d71920",
        accent: "#ffffff"
    },

    wizzair: {
        name: "Wizz Air",
        color: "#c6007e",
        accent: "#ffffff"
    },

    britishairways: {
        name: "British Airways",
        color: "#003b7a",
        accent: "#e31837"
    }
};


const player = {
    x: 0,
    y: 0,
    width: 55,
    height: 75,
    speed: 5
};


let clouds = [];
let cloudTimer = 0;


// -----------------------------------
// CANVAS
// -----------------------------------

function resizeCanvas() {

    width = canvas.clientWidth;
    height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    if (!gameRunning) {

        player.x = width / 2;
        player.y = height - 120;

    }
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// -----------------------------------
// KEYBOARD
// -----------------------------------

document.addEventListener("keydown", function(event) {

    keys[event.key.toLowerCase()] = true;

    if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
    ) {
        event.preventDefault();
    }

});

document.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;

});


// -----------------------------------
// PLANE SELECTION
// -----------------------------------

function selectPlane(type) {

    selectedPlane = type;

    document.querySelectorAll(".planeChoice").forEach(button => {

        button.classList.remove("selected");

    });

    const selected = document.querySelector(
        `[data-plane="${type}"]`
    );

    if (selected) {
        selected.classList.add("selected");
    }

}


// -----------------------------------
// START GAME
// -----------------------------------

function startGame() {

    gameRunning = true;
    crashed = false;

    player.x = width / 2;
    player.y = height - 120;

    clouds = [];
    cloudTimer = 0;

    message.classList.add("hidden");

    requestAnimationFrame(gameLoop);

}


// -----------------------------------
// CRASH
// -----------------------------------

function crash() {

    gameRunning = false;
    crashed = true;

    message.innerHTML = `

        <h1>💥 CRASH!</h1>

        <p>
            Your ${planes[selectedPlane].name} crashed!
        </p>

        <button id="restartButton">
            FLY AGAIN
        </button>

    `;

    message.classList.remove("hidden");

    document
        .getElementById("restartButton")
        .addEventListener("click", startGame);

}


// -----------------------------------
// PLAYER MOVEMENT
// -----------------------------------

function movePlayer() {

    if (
        keys["arrowleft"] ||
        keys["a"]
    ) {

        player.x -= player.speed;

    }

    if (
        keys["arrowright"] ||
        keys["d"]
    ) {

        player.x += player.speed;

    }

    if (
        keys["arrowup"] ||
        keys["w"]
    ) {

        player.y -= player.speed;

    }

    if (
        keys["arrowdown"] ||
        keys["s"]
    ) {

        player.y += player.speed;

    }


    // Keep plane on screen

    player.x = Math.max(
        player.width / 2,
        Math.min(
            width - player.width / 2,
            player.x
        )
    );


    player.y = Math.max(
        player.height / 2,
        Math.min(
            height - player.height / 2,
            player.y
        )
    );

}


// -----------------------------------
// CREATE CLOUD
// -----------------------------------

function createCloud() {

    clouds.push({

        x: 40 + Math.random() * (width - 80),

        y: -100,

        width: 90 + Math.random() * 80,

        height: 50 + Math.random() * 30,

        speed: 2 + Math.random() * 2

    });

}


// -----------------------------------
// COLLISION
// -----------------------------------

function checkCollision(a, b) {

    return (

        Math.abs(a.x - b.x) <
        (a.width + b.width) / 2

        &&

        Math.abs(a.y - b.y) <
        (a.height + b.height) / 2

    );

}


// -----------------------------------
// UPDATE
// -----------------------------------

function update() {

    movePlayer();


    // Create clouds

    cloudTimer--;

    if (cloudTimer <= 0) {

        createCloud();

        cloudTimer =
            70 + Math.random() * 70;

    }


    // Move clouds

    clouds.forEach(cloud => {

        cloud.y += cloud.speed;

    });


    // Check collision

    for (const cloud of clouds) {

        if (checkCollision(player, cloud)) {

            crash();

            return;

        }

    }


    // Remove old clouds

    clouds = clouds.filter(
        cloud => cloud.y < height + 150
    );

}


// -----------------------------------
// DRAW SKY
// -----------------------------------

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            height
        );

    gradient.addColorStop(
        0,
        "#38bdf8"
    );

    gradient.addColorStop(
        1,
        "#dff6ff"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // Sun

    ctx.fillStyle = "#fff3a3";

    ctx.beginPath();

    ctx.arc(
        width - 100,
        100,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


// -----------------------------------
// DRAW CLOUD
// -----------------------------------

function drawCloud(cloud) {

    ctx.fillStyle =
        "rgba(255,255,255,0.85)";


    ctx.beginPath();

    ctx.ellipse(
        cloud.x,
        cloud.y,
        cloud.width / 2,
        cloud.height / 2,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        cloud.x - 30,
        cloud.y - 10,
        25,
        0,
        Math.PI * 2
    );

    ctx.arc(
        cloud.x + 5,
        cloud.y - 20,
        35,
        0,
        Math.PI * 2
    );

    ctx.arc(
        cloud.x + 35,
        cloud.y - 5,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


// -----------------------------------
// DRAW AIRPLANE
// -----------------------------------

function drawPlane() {

    const plane =
        planes[selectedPlane];

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );


    // Main body

    ctx.fillStyle =
        plane.color;

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        11,
        38,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Nose

    ctx.beginPath();

    ctx.moveTo(0, -45);

    ctx.lineTo(12, -15);

    ctx.lineTo(-12, -15);

    ctx.closePath();

    ctx.fill();


    // Wings

    ctx.fillStyle =
        plane.color;

    ctx.beginPath();

    ctx.moveTo(-7, -5);

    ctx.lineTo(-42, 20);

    ctx.lineTo(-38, 28);

    ctx.lineTo(-5, 17);

    ctx.closePath();

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(7, -5);

    ctx.lineTo(42, 20);

    ctx.lineTo(38, 28);

    ctx.lineTo(5, 17);

    ctx.closePath();

    ctx.fill();


    // Tail

    ctx.beginPath();

    ctx.moveTo(0, 25);

    ctx.lineTo(-15, 38);

    ctx.lineTo(-8, 42);

    ctx.lineTo(0, 32);

    ctx.lineTo(8, 42);

    ctx.lineTo(15, 38);

    ctx.closePath();

    ctx.fill();


    // Windows

    ctx.fillStyle =
        "#bde9ff";

    for (
        let y = -10;
        y <= 17;
        y += 9
    ) {

        ctx.beginPath();

        ctx.arc(
            0,
            y,
            2.5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // Airline accent

    ctx.fillStyle =
        plane.accent;

    ctx.fillRect(
        -10,
        -2,
        20,
        5
    );


    ctx.restore();

}


// -----------------------------------
// DRAW
// -----------------------------------

function draw() {

    drawBackground();

    clouds.forEach(drawCloud);

    drawPlane();

}


// -----------------------------------
// GAME LOOP
// -----------------------------------

function gameLoop() {

    if (!gameRunning) {

        draw();

        return;

    }


    update();

    draw();


    requestAnimationFrame(
        gameLoop
    );

}


// -----------------------------------
// PLANE CHOOSER
// -----------------------------------

function createPlaneSelector() {

    const selector =
        document.createElement("div");

    selector.id = "planeSelector";

    selector.innerHTML = `

        <div class="planeChoice selected"
             data-plane="emirates">

            <strong>🇦🇪 Emirates</strong>

        </div>

        <div class="planeChoice"
             data-plane="wizzair">

            <strong>💜 Wizz Air</strong>

        </div>

        <div class="planeChoice"
             data-plane="britishairways">

            <strong>🇬🇧 British Airways</strong>

        </div>

    `;


    message.insertBefore(
        selector,
        message.querySelector("button")
    );


    selector
        .querySelectorAll(".planeChoice")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectPlane(
                        button.dataset.plane
                    );

                }
            );

        });

}

document.getElementById("startBtn").addEventListener("click", startGame);

createPlaneSelector();


// Initial drawing

draw();
