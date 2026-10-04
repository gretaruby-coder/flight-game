const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


const mainMenu =
    document.getElementById("mainMenu");

const crashScreen =
    document.getElementById("crashScreen");

const startButton =
    document.getElementById("startButton");

const menuButton =
    document.getElementById("menuButton");

const hud =
    document.getElementById("hud");

const distanceDisplay =
    document.getElementById("distance");

const finalDistance =
    document.getElementById("finalDistance");

const airlineName =
    document.getElementById("airlineName");

const crashMessage =
    document.getElementById("crashMessage");



/* ---------------------------
   GAME VARIABLES
--------------------------- */

let width;
let height;

let gameRunning = false;

let selectedPlane = "emirates";

let distance = 0;

let clouds = [];

let traffic = [];

let cloudTimer = 0;

let trafficTimer = 0;

let lastTime = 0;


const keys = {};



/* ---------------------------
   AIRLINES
--------------------------- */

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

        name:
            "British Airways",

        body: "#ffffff",

        tail: "#123f78",

        stripe: "#d7193f"

    }

};



/* ---------------------------
   PLAYER
--------------------------- */

const player = {

    x: 0,

    y: 0,

    width: 55,

    height: 80,

    speed: 350

};



/* ---------------------------
   RESIZE CANVAS
--------------------------- */

function resizeCanvas() {

    width =
        canvas.clientWidth;

    height =
        canvas.clientHeight;


    canvas.width =
        width;

    canvas.height =
        height;


    if (!gameRunning) {

        player.x =
            width / 2;

        player.y =
            height - 120;

    }

}


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();



/* ---------------------------
   PLANE SELECTION
--------------------------- */

const planeChoices = document.querySelectorAll(".planeChoice");

planeChoices.forEach((button) => {

    button.addEventListener("click", () => {

        // Change selected aircraft
        selectedPlane = button.dataset.plane;

        // Remove selection from every plane
        planeChoices.forEach((choice) => {
            choice.classList.remove("selected");
        });

        // Highlight clicked plane
        button.classList.add("selected");

        console.log("Selected plane:", selectedPlane);
    });

});


/* ---------------------------
   KEYBOARD
--------------------------- */

document.addEventListener(
    "keydown",
    function(event) {

        keys[
            event.key.toLowerCase()
        ] = true;


        if (
            event.key.startsWith(
                "Arrow"
            )
        ) {

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);



/* ---------------------------
   START GAME
--------------------------- */

startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    gameRunning = true;

    distance = 0;

    clouds = [];

    traffic = [];

    cloudTimer = 0;

    trafficTimer = 2;


    player.x =
        width / 2;

    player.y =
        height - 110;


    mainMenu.classList
        .add("hidden");

    crashScreen.classList
        .add("hidden");


    hud.style.display =
        "flex";


    airlineName.textContent =
        "✈️ " +
        airlines[selectedPlane].name;


    distanceDisplay.textContent =
        "0";


    lastTime =
        performance.now();


    requestAnimationFrame(
        gameLoop
    );

}



/* ---------------------------
   MAIN MENU
--------------------------- */

menuButton.addEventListener(
    "click",
    returnToMenu
);


function returnToMenu() {

    gameRunning = false;


    crashScreen.classList
        .add("hidden");


    mainMenu.classList
        .remove("hidden");


    hud.style.display =
        "none";


    clouds = [];

    traffic = [];


    drawBackground();

}



/* ---------------------------
   PLAYER MOVEMENT
--------------------------- */

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


    if (dx !== 0 && dy !== 0) {

        dx *= 0.707;

        dy *= 0.707;

    }


    player.x +=
        dx *
        player.speed *
        dt;


    player.y +=
        dy *
        player.speed *
        dt;


    player.x =
        Math.max(
            35,
            Math.min(
                width - 35,
                player.x
            )
        );


    player.y =
        Math.max(
            50,
            Math.min(
                height - 50,
                player.y
            )
        );

}



/* ---------------------------
   CREATE CLOUD
--------------------------- */

function createCloud() {

    const size =
        45 +
        Math.random() * 45;


    clouds.push({

        x:
            size +
            Math.random() *
            (width - size * 2),

        y:
            -100,

        width:
            size * 1.8,

        height:
            size,

        speed:
            110 +
            Math.random() * 80

    });

}



/* ---------------------------
   CREATE TRAFFIC PLANE
--------------------------- */

function createTrafficPlane() {

    const colours = [

        "#ef4444",

        "#2563eb",

        "#f97316",

        "#7c3aed",

        "#16a34a",

        "#475569"

    ];


    traffic.push({

        x:
            45 +
            Math.random() *
            (width - 90),

        y:
            -100,

        width:
            52,

        height:
            75,

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



/* ---------------------------
   COLLISION
--------------------------- */

function collision(
    a,
    b,
    padding = 10
) {

    return (

        Math.abs(
            a.x - b.x
        )
        <
        (
            a.width +
            b.width
        ) / 2
        - padding


        &&


        Math.abs(
            a.y - b.y
        )
        <
        (
            a.height +
            b.height
        ) / 2
        - padding

    );

}



/* ---------------------------
   CRASH
--------------------------- */

function crash(reason) {

    gameRunning = false;


    hud.style.display =
        "none";


    finalDistance.textContent =
        Math.floor(distance);


    crashMessage.textContent =
        reason;


    crashScreen.classList
        .remove("hidden");

}



/* ---------------------------
   UPDATE GAME
--------------------------- */

function update(dt) {

    movePlayer(dt);


    distance +=
        dt * 12;


    distanceDisplay.textContent =
        Math.floor(distance);



    /* CLOUD TIMER */

    cloudTimer -= dt;


    if (cloudTimer <= 0) {

        createCloud();

        cloudTimer =
            0.9 +
            Math.random() * 1.1;

    }



    /* PLANE TIMER */

    trafficTimer -= dt;


    if (trafficTimer <= 0) {

        createTrafficPlane();

        trafficTimer =
            1.6 +
            Math.random() * 1.8;

    }



    /* MOVE CLOUDS */

    clouds.forEach(
        cloud => {

            cloud.y +=
                cloud.speed * dt;

        }
    );



    /* MOVE PLANES */

    traffic.forEach(
        plane => {

            plane.y +=
                plane.speed * dt;

        }
    );



    /* CLOUD COLLISION */

    for (
        const cloud of clouds
    ) {

        if (
            collision(
                player,
                cloud,
                18
            )
        ) {

            crash(
                "You flew into a cloud!"
            );

            return;

        }

    }



    /* PLANE COLLISION */

    for (
        const plane of traffic
    ) {

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



    /* REMOVE OLD OBJECTS */

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



/* ---------------------------
   SKY
--------------------------- */

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


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        width,
        height
    );



    /* SUN */

    ctx.fillStyle =
        "#fff1a8";


    ctx.beginPath();


    ctx.arc(
        width - 100,
        90,
        42,
        0,
        Math.PI * 2
    );


    ctx.fill();

}



/* ---------------------------
   CLOUD
--------------------------- */

function drawCloud(cloud) {

    ctx.save();


    ctx.fillStyle =
        "rgba(255,255,255,.9)";


    ctx.beginPath();


    ctx.ellipse(
        cloud.x,
        cloud.y,
        cloud.width / 2,
        cloud.height / 2.4,
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
        cloud.y - 22,
        34,
        0,
        Math.PI * 2
    );


    ctx.arc(
        cloud.x + 35,
        cloud.y - 5,
        24,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.restore();

}



/* ---------------------------
   DRAW AIRCRAFT
--------------------------- */

function drawAircraft(
    x,
    y,
    bodyColour,
    tailColour,
    stripeColour
) {

    ctx.save();


    ctx.translate(
        x,
        y
    );



    /* WINGS */

    ctx.fillStyle =
        bodyColour;


    ctx.strokeStyle =
        "#5b6570";


    ctx.lineWidth =
        2;


    ctx.beginPath();


    ctx.moveTo(
        -7,
        -5
    );


    ctx.lineTo(
        -42,
        20
    );


    ctx.lineTo(
        -38,
        28
    );


    ctx.lineTo(
        -6,
        15
    );


    ctx.lineTo(
        6,
        15
    );


    ctx.lineTo(
        38,
        28
    );


    ctx.lineTo(
        42,
        20
    );


    ctx.lineTo(
        7,
        -5
    );


    ctx.closePath();


    ctx.fill();

    ctx.stroke();



    /* BODY */

    ctx.fillStyle =
        bodyColour;


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



    /* NOSE */

    ctx.beginPath();


    ctx.moveTo(
        0,
        -47
    );


    ctx.lineTo(
        10,
        -20
    );


    ctx.lineTo(
        -10,
        -20
    );


    ctx.closePath();


    ctx.fill();

    ctx.stroke();



    /* TAIL */

    ctx.fillStyle =
        tailColour;


    ctx.beginPath();


    ctx.moveTo(
        0,
        25
    );


    ctx.lineTo(
        -16,
        40
    );


    ctx.lineTo(
        -8,
        43
    );


    ctx.lineTo(
        0,
        34
    );


    ctx.lineTo(
        8,
        43
    );


    ctx.lineTo(
        16,
        40
    );


    ctx.closePath();


    ctx.fill();



    /* AIRLINE STRIPE */

    ctx.fillStyle =
        stripeColour;


    ctx.fillRect(
        -9,
        -4,
        18,
        5
    );



    /* COCKPIT */

    ctx.fillStyle =
        "#163b59";


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



/* ---------------------------
   PLAYER AIRCRAFT
--------------------------- */

function drawPlayer() {

    const airline =
        airlines[selectedPlane];


    drawAircraft(

        player.x,

        player.y,

        airline.body,

        airline.tail,

        airline.stripe

    );

}



/* ---------------------------
   TRAFFIC AIRCRAFT
--------------------------- */

function drawTrafficPlane(
    plane
) {

    drawAircraft(

        plane.x,

        plane.y,

        "#eeeeee",

        plane.colour,

        plane.colour

    );

}



/* ---------------------------
   DRAW GAME
--------------------------- */

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



/* ---------------------------
   GAME LOOP
--------------------------- */

function gameLoop(time) {

    if (!gameRunning) {

        return;

    }


    const dt =
        Math.min(
            0.033,
            (time - lastTime)
            / 1000
        );


    lastTime =
        time;


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



/* INITIAL SKY */

drawBackground();    max-height: 750px;

    overflow: hidden;

    background: #62c8f5;
}


/* CANVAS */

#gameCanvas {

    position: absolute;

    width: 100%;
    height: 100%;

    top: 0;
    left: 0;
}


/* SCREENS */

.screen {

    position: absolute;

    inset: 0;

    z-index: 10;

    display: flex;

    flex-direction: column;

    align-items: center;
    justify-content: center;

    text-align: center;

    color: white;

    padding: 30px;

    background:
        linear-gradient(
            rgba(5, 24, 45, 0.45),
            rgba(5, 24, 45, 0.65)
        );
}


.hidden {
    display: none !important;
}


/* TITLE */

h1 {

    margin: 0 0 10px;

    font-size: clamp(
        40px,
        7vw,
        75px
    );

    text-shadow:
        0 4px 12px
        rgba(0,0,0,.4);
}


.subtitle {

    font-size: 21px;

    margin-bottom: 28px;
}


/* PLANE SELECTION */

#planeChoices {

    display: flex;

    justify-content: center;

    gap: 18px;

    width: 100%;

    margin-bottom: 30px;

    flex-wrap: wrap;
}


.planeChoice {

    width: 190px;
    height: 150px;

    border-radius: 18px;

    border: 3px solid
        rgba(255,255,255,.4);

    background:
        rgba(255,255,255,.15);

    color: white;

    cursor: pointer;

    display: flex;

    flex-direction: column;

    align-items: center;
    justify-content: center;

    transition: .2s;

    backdrop-filter:
        blur(8px);
}


.planeChoice:hover {

    transform:
        translateY(-5px);

    background:
        rgba(255,255,255,.25);
}


.planeChoice.selected {

    border:
        4px solid #ffd84d;

    background:
        rgba(255,216,77,.22);

    transform:
        translateY(-7px);

    box-shadow:
        0 8px 30px
        rgba(0,0,0,.3);
}


.planeIcon {

    font-size: 48px;

    margin-bottom: 10px;
}


.planeChoice strong {

    font-size: 18px;
}


.planeChoice small {

    margin-top: 5px;

    opacity: .75;
}


/* BUTTON */

#startButton,
#menuButton {

    border: none;

    padding:
        16px 38px;

    border-radius:
        50px;

    background:
        #ffd43b;

    color:
        #16263a;

    font-size:
        18px;

    font-weight:
        bold;

    cursor:
        pointer;

    box-shadow:
        0 6px 0
        #b99000;
}


#startButton:hover,
#menuButton:hover {

    transform:
        translateY(-2px);
}


#startButton:active,
#menuButton:active {

    transform:
        translateY(4px);

    box-shadow:
        0 2px 0
        #b99000;
}


.controls {

    margin-top: 22px;

    font-size: 14px;

    opacity: .8;
}


/* HUD */

#hud {

    position: absolute;

    z-index: 5;

    top: 20px;
    left: 25px;
    right: 25px;

    display: none;

    justify-content:
        space-between;

    color: white;

    font-size: 18px;

    font-weight: bold;

    text-shadow:
        0 2px 5px
        rgba(0,0,0,.6);

    pointer-events: none;
}


/* MOBILE */

@media (max-width: 650px) {

    .planeChoice {

        width: 120px;
        height: 120px;

    }

    .planeIcon {

        font-size: 35px;

    }

    .planeChoice strong {

        font-size: 14px;

    }

}
