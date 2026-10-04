* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    background: #071525;
}


/* GAME */

body {
    display: flex;
    align-items: center;
    justify-content: center;
}

#gameContainer {

    position: relative;

    width: 100vw;
    height: 100vh;

    max-width: 1100px;
    max-height: 750px;

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
