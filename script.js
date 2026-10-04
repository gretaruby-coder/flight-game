// ============================================
// AIRLINE PILOT
// ============================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const mainMenu = document.getElementById("mainMenu");
const crashScreen = document.getElementById("crashScreen");
const startButton = document.getElementById("startButton");
const menuButton = document.getElementById("menuButton");

const hud = document.getElementById("hud");
const airlineName = document.getElementById("airlineName");
const distanceDisplay = document.getElementById("distance");
const finalDistance = document.getElementById("finalDistance");
const crashMessage = document.getElementById("crashMessage");


// ============================================
// AIRLINES
// ============================================

const airlines = {

    emirates: {
        name: "Emirates",
        body: "#ffffff",
        tail: "#d71920",
        stripe: "#c8a951"
    },

    qatar: {
        name: "Qatar Airways",
        body: "#ffffff",
        tail: "#8a1538",
        stripe: "#8a1538"
    },

    british: {
        name: "British Airways",
        body: "#ffffff",
        tail: "#123f78",
        stripe: "#d7193f"
    }

};


// ============================================
// GAME VARIABLES
// ============================================

let selectedPlane = "emirates";

let gameRunning = false;

let distance = 0;

let clouds = [];

let traffic = [];

let cloudTimer = 0;

let trafficTimer = 0;

let lastTime = 0;

let width = 0;

let height = 0;

const keys = {};


// ============================================
// PLAYER
// ============================================

const player = {

    x: 0,
    y: 0,

    width: 50,
    height: 75,

    speed: 350

};


// ============================================
// CANVAS SIZE
// ============================================

function resizeCanvas() {

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    if (!gameRunning) {

        player.x = width / 2;
        player.y = height - 120;

    }

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// ============================================
// PLANE SELECTION
// ============================================

const planeButtons =
    document.querySelectorAll(".planeChoice");


planeButtons.forEach(button => {

    button.addEventListener("click", function () {

        selectedPlane =
            this.getAttribute("data-plane");


        planeButtons.forEach(otherButton => {

            otherButton.classList.remove("selected");

        });


        this.classList.add("selected");

    });

});


// ============================================
// START BUTTON
// ============================================

startButton.addEventListener("click", function () {

    startGame();

});


// ============================================
// MAIN MENU BUTTON
// ============================================

menuButton.addEventListener("click", function () {

    returnToMenu();

});


// ============================================
// KEYBOARD
// ============================================

document.addEventListener("keydown", function (event) {

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


document.addEventListener("keyup", function (event) {

    keys[event.key.toLowerCase()] = false;

});


// ============================================
// START GAME
// ============================================

function startGame() {

    gameRunning = true;

    distance = 0;

    clouds = [];

    traffic = [];

    cloudTimer = 0;

    trafficTimer = 1.5;


    player.x = width / 2;

    player.y = height - 120;


    mainMenu.classList.add("hidden");

    crashScreen.classList.add("hidden");


    hud.style.display = "flex";


    airlineName.textContent =
        "✈ " + airlines[selectedPlane].name;


    distanceDisplay.textContent = "0";


    lastTime = performance.now();


    requestAnimationFrame(gameLoop);

}


// ============================================
// RETURN TO MENU
// ============================================

function returnToMenu() {

    gameRunning = false;

    clouds = [];

    traffic = [];


    crashScreen.classList.add("hidden");

    mainMenu.classList.remove("hidden");

    hud.style.display = "none";


    drawBackground();

}


// ============================================
// PLAYER MOVEMENT
// ============================================

function movePlayer(dt) {

    let dx = 0;
    let dy = 0;


    if (
        keys["arrowleft"] ||
        keys["a"]
    ) {

        dx -= 1;

    }


    if (
        keys["arrowright"] ||
        keys["d"]
    ) {

        dx += 1;

    }


    if (
        keys["arrowup"] ||
        keys["w"]
    ) {

        dy -= 1;

    }


    if (
        keys["arrowdown"] ||
        keys["s"]
    ) {

        dy += 1;

    }


    // Prevent diagonal movement being faster

    if (dx !== 0 && dy !== 0) {

        dx *= 0.707;
        dy *= 0.707;

    }


    player.x +=
        dx * player.speed * dt;


    player.y +=
        dy * player.speed * dt;


    // Keep aircraft inside screen

    player.x =
        Math.max(
            40,
            Math.min(
                width - 40,
                player.x
            )
        );


    player.y =
        Math.max(
            55,
            Math.min(
                height - 55,
                player.y
            )
        );

}


// ============================================
// CREATE CLOUD
// ============================================

function createCloud() {

    const size =
        50 + Math.random() * 50;


    clouds.push({

        x:
            size +
            Math.random() *
            Math.max(
                1,
                width - size * 2
            ),

        y: -100,

        width: size * 1.8,

        height: size,

        speed:
            100 +
            Math.random() * 80

    });

}


// ============================================
// CREATE OTHER AIRCRAFT
// ============================================

function createTrafficPlane() {

    const colours = [

        "#e63946",
        "#2563eb",
        "#f97316",
        "#16a34a",
        "#7c3aed",
        "#475569"

    ];


    traffic.push({

        x:
            50 +
            Math.random() *
            Math.max(
                1,
                width - 100
            ),

        y: -100,

        width: 50,

        height: 75,

        speed:
            150 +
            Math.random() * 100,

        colour:
            colours[
                Math.floor(
                    Math.random() *
                    colours.length
                )
            ]

    });

}


// ============================================
// COLLISION
// ============================================

function collision(a, b, padding = 10) {

    return (

        Math.abs(a.x - b.x)
        <
        (a.width + b.width) / 2
        - padding

        &&

        Math.abs(a.y - b.y)
        <
        (a.height + b.height) / 2
        - padding

    );

}


// ============================================
// CRASH
// ============================================

function crash(message) {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;


    hud.style.display = "none";


    crashMessage.textContent = message;


    finalDistance.textContent =
        Math.floor(distance);


    crashScreen.classList.remove("hidden");

}


// ============================================
// UPDATE GAME
// ============================================

function update(dt) {

    movePlayer(dt);


    distance += dt * 12;


    distanceDisplay.textContent =
        Math.floor(distance);


    // ----------------
    // CLOUDS
    // ----------------

    cloudTimer -= dt;


    if (cloudTimer <= 0) {

    // Difficulty increases every 100 km
    const level = Math.floor(distance / 100);

    // More clouds at higher levels
const cloudAmount = Math.min(5, 1 + level);

    for (let i = 0; i < cloudAmount; i++) {
        createCloud();
    }

    // Clouds also appear more frequently
    cloudTimer = Math.max(
        0.45,
        1.2 - (level * 0.1)
    ) + Math.random() * 0.8;

}


    clouds.forEach(cloud => {

        cloud.y +=
            cloud.speed * dt;

    });


    // ----------------
    // OTHER PLANES
    // ----------------

    trafficTimer -= dt;


   if (trafficTimer <= 0) {

    // Difficulty increases every 100 km
    const level = Math.floor(distance / 100);

    // More aircraft at higher levels
    const planeAmount = Math.min(5, 1 + level);

    for (let i = 0; i < planeAmount; i++) {
        createTrafficPlane();
    }

    // Aircraft also appear more frequently
    trafficTimer = Math.max(
        0.7,
        2 - (level * 0.12)
    ) + Math.random() * 1.2;

}


    traffic.forEach(plane => {

        plane.y +=
            plane.speed * dt;

    });


    // ----------------
    // CLOUD COLLISION
    // ----------------

    for (const cloud of clouds) {

        if (
            collision(
                player,
                cloud,
                20
            )
        ) {

            crash(
                "You flew into a cloud!"
            );

            return;

        }

    }


    // ----------------
    // AIRCRAFT COLLISION
    // ----------------

    for (const plane of traffic) {

        if (
            collision(
                player,
                plane,
                12
            )
        ) {

            crash(
                "You collided with another aircraft!"
            );

            return;

        }

    }


    // Remove things that passed the player

    clouds =
        clouds.filter(
            cloud =>
                cloud.y <
                height + 150
        );


    traffic =
        traffic.filter(
            plane =>
                plane.y <
                height + 150
        );

}


// ============================================
// BACKGROUND
// ============================================

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
        "#3eb8ee"
    );


    gradient.addColorStop(
        1,
        "#d9f5ff"
    );


    ctx.fillStyle = gradient;


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // Sun

    ctx.fillStyle =
        "rgba(255,245,170,.9)";


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


// ============================================
// DRAW CLOUD
// ============================================

function drawCloud(cloud) {

    ctx.save();


    ctx.fillStyle =
        "rgba(255,255,255,.92)";


    ctx.beginPath();


    ctx.ellipse(
        cloud.x,
        cloud.y,

        cloud.width / 2,
        cloud.height / 2.5,

        0,

        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.beginPath();


    ctx.arc(
        cloud.x - 30,
        cloud.y - 8,
        25,
        0,
        Math.PI * 2
    );


    ctx.arc(
        cloud.x + 3,
        cloud.y - 22,
        35,
        0,
        Math.PI * 2
    );


    ctx.arc(
        cloud.x + 35,
        cloud.y - 6,
        26,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.restore();

}


// ============================================
// DRAW AIRCRAFT
// ============================================

function drawAircraft(
    x,
    y,
    body,
    tail,
    stripe,
    scale = 1
) {

    ctx.save();


    ctx.translate(x, y);

    ctx.scale(scale, scale);


    // Wings

    ctx.fillStyle = body;

    ctx.strokeStyle = "#7b8791";

    ctx.lineWidth = 1.5;


    ctx.beginPath();

    ctx.moveTo(-7, -5);

    ctx.lineTo(-42, 20);

    ctx.lineTo(-38, 27);

    ctx.lineTo(-6, 15);

    ctx.lineTo(6, 15);

    ctx.lineTo(38, 27);

    ctx.lineTo(42, 20);

    ctx.lineTo(7, -5);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    // Fuselage

    ctx.fillStyle = body;


    ctx.beginPath();


    ctx.ellipse(
        0,
        0,
        10,
        38,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();

    ctx.stroke();


    // Nose

    ctx.beginPath();

    ctx.moveTo(0, -48);

    ctx.lineTo(10, -20);

    ctx.lineTo(-10, -20);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    // Tail

    ctx.fillStyle = tail;


    ctx.beginPath();

    ctx.moveTo(0, 25);

    ctx.lineTo(-16, 40);

    ctx.lineTo(-8, 43);

    ctx.lineTo(0, 34);

    ctx.lineTo(8, 43);

    ctx.lineTo(16, 40);

    ctx.closePath();

    ctx.fill();


    // Airline stripe

    ctx.fillStyle = stripe;


    ctx.fillRect(
        -9,
        -3,
        18,
        5
    );


    // Cockpit

    ctx.fillStyle = "#193b53";


    ctx.beginPath();


    ctx.ellipse(
        0,
        -25,
        5,
        6,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.restore();

}


// ============================================
// PLAYER AIRCRAFT
// ============================================

function drawPlayer() {

    ctx.save();
    ctx.translate(player.x, player.y);

    if (selectedPlane === "emirates") {
        drawEmiratesPlayer();
    }

    else if (selectedPlane === "qatar") {
        drawQatarPlayer();
    }

    else if (selectedPlane === "british") {
        drawBritishPlayer();
    }

    ctx.restore();
}

// ============================================
// EMIRATES A380
// ============================================

function drawEmiratesPlayer() {

    ctx.save();
    ctx.scale(1.15, 1.15);

    // Huge A380 wings
    ctx.fillStyle = "#e5e9ec";
    ctx.beginPath();
    ctx.moveTo(-8, -8);
    ctx.lineTo(-48, 18);
    ctx.lineTo(-45, 27);
    ctx.lineTo(-8, 15);
    ctx.lineTo(8, 15);
    ctx.lineTo(45, 27);
    ctx.lineTo(48, 18);
    ctx.lineTo(8, -8);
    ctx.closePath();
    ctx.fill();

    // Four engines
    ctx.fillStyle = "#cbd2d7";

    ctx.beginPath();
    ctx.ellipse(-29, 15, 5, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(-15, 11, 5, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(15, 11, 5, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(29, 15, 5, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fuselage
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.lineTo(-10, -25);
    ctx.lineTo(10, -25);
    ctx.closePath();
    ctx.fill();

    // Emirates gold stripe
    ctx.fillStyle = "#c8a951";
    ctx.fillRect(-7, -13, 4, 38);

    // Red tail wings
    ctx.fillStyle = "#d71920";

    ctx.beginPath();
    ctx.moveTo(0, 25);
    ctx.lineTo(-22, 40);
    ctx.lineTo(-8, 42);
    ctx.lineTo(0, 34);
    ctx.lineTo(8, 42);
    ctx.lineTo(22, 40);
    ctx.closePath();
    ctx.fill();

    // Vertical tail
    ctx.beginPath();
    ctx.moveTo(0, 19);
    ctx.lineTo(-6, 43);
    ctx.lineTo(6, 43);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = "#17374b";
    ctx.beginPath();
    ctx.ellipse(0, -29, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}


// ============================================
// QATAR AIRWAYS 777
// ============================================

function drawQatarPlayer() {

    ctx.save();

    // Long swept wings
    ctx.fillStyle = "#e5e9ec";

    ctx.beginPath();
    ctx.moveTo(-7, -5);
    ctx.lineTo(-44, 20);
    ctx.lineTo(-39, 25);
    ctx.lineTo(-6, 14);
    ctx.lineTo(6, 14);
    ctx.lineTo(39, 25);
    ctx.lineTo(44, 20);
    ctx.lineTo(7, -5);
    ctx.closePath();
    ctx.fill();

    // Two large 777 engines
    ctx.fillStyle = "#d4d8dc";

    ctx.beginPath();
    ctx.ellipse(-22, 16, 7, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(22, 16, 7, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Engine centres
    ctx.fillStyle = "#596773";

    ctx.beginPath();
    ctx.ellipse(-22, 13, 3, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(22, 13, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Long fuselage
    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.beginPath();
    ctx.moveTo(0, -53);
    ctx.lineTo(-9, -25);
    ctx.lineTo(9, -25);
    ctx.closePath();
    ctx.fill();

    // Qatar burgundy stripe
    ctx.fillStyle = "#8a1538";
    ctx.fillRect(3, -10, 4, 38);

    // Tail
    ctx.beginPath();
    ctx.moveTo(0, 27);
    ctx.lineTo(-19, 41);
    ctx.lineTo(-7, 42);
    ctx.lineTo(0, 35);
    ctx.lineTo(7, 42);
    ctx.lineTo(19, 41);
    ctx.closePath();
    ctx.fill();

    // Tail fin
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.lineTo(-6, 44);
    ctx.lineTo(6, 44);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = "#17374b";

    ctx.beginPath();
    ctx.ellipse(0, -31, 4.5, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}


// ============================================
// BRITISH AIRWAYS 787
// ============================================

function drawBritishPlayer() {

    ctx.save();
    ctx.scale(0.98, 0.98);

    // Swept Dreamliner wings
    ctx.fillStyle = "#e4e9ed";

    ctx.beginPath();
    ctx.moveTo(-6, -6);

    ctx.lineTo(-48, 18);
    ctx.lineTo(-43, 23);
    ctx.lineTo(-20, 18);
    ctx.lineTo(-6, 12);

    ctx.lineTo(6, 12);

    ctx.lineTo(20, 18);
    ctx.lineTo(43, 23);
    ctx.lineTo(48, 18);

    ctx.lineTo(6, -6);

    ctx.closePath();
    ctx.fill();

    // Two engines
    ctx.fillStyle = "#123f78";

    ctx.beginPath();
    ctx.ellipse(-22, 14, 6, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(22, 14, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // White fuselage
    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.lineTo(-9, -24);
    ctx.lineTo(9, -24);
    ctx.closePath();
    ctx.fill();

    // BA blue lower/rear fuselage
    ctx.fillStyle = "#123f78";

    ctx.beginPath();
    ctx.moveTo(-8, 10);
    ctx.lineTo(8, 10);
    ctx.lineTo(7, 38);
    ctx.lineTo(-7, 38);
    ctx.closePath();
    ctx.fill();

    // Blue tail
    ctx.beginPath();
    ctx.moveTo(0, 24);
    ctx.lineTo(-19, 40);
    ctx.lineTo(-7, 42);
    ctx.lineTo(0, 34);
    ctx.lineTo(7, 42);
    ctx.lineTo(19, 40);
    ctx.closePath();
    ctx.fill();

    // BA red tail accent
    ctx.fillStyle = "#d7193f";

    ctx.beginPath();
    ctx.moveTo(-5, 39);
    ctx.lineTo(6, 27);
    ctx.lineTo(4, 42);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = "#17374b";

    ctx.beginPath();
    ctx.ellipse(0, -28, 4.5, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}
// ============================================
// OTHER AIRCRAFT
// ============================================

function drawTrafficPlane(plane) {

    drawAircraft(

        plane.x,

        plane.y,

        "#eeeeee",

        plane.colour,

        plane.colour,

        0.9

    );

}


// ============================================
// DRAW EVERYTHING
// ============================================

function draw() {

    drawBackground();


    clouds.forEach(
        drawCloud
    );


    traffic.forEach(
        drawTrafficPlane
    );


    drawPlayer();

}


// ============================================
// GAME LOOP
// ============================================

function gameLoop(time) {

    if (!gameRunning) {

        return;

    }


    const dt =
        Math.min(
            0.033,
            (time - lastTime) / 1000
        );


    lastTime = time;


    update(dt);


    if (!gameRunning) {

        draw();

        return;

    }


    draw();


    requestAnimationFrame(
        gameLoop
    );

}


// Draw initial background
drawBackground();
