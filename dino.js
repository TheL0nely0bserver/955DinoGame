//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoRunImages = [];
let dinoDead;
let dinoFrame = 0;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

//cactus
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img, cactus2Img, cactus3Img;

//diamond
let diamondWidth = 40;
let diamondHeight = 40;
let diamondX = 700;
let diamondY = boardHeight - diamondHeight - 50;
let diamondImg;
let diamond = null;

//physics
let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let lives = 1;

// Restart button
let restartButton;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    dinoRunImages.push(new Image());
    dinoRunImages[0].src = "./img/dino-run1.png";
    dinoRunImages.push(new Image());
    dinoRunImages[1].src = "./img/dino-run2.png";
    dinoDead = new Image();
    dinoDead.src = "./img/dino-dead.png";

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";
    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";
    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    diamondImg = new Image();
    diamondImg.src = "./img/Heart-Photoroom.png";

    restartButton = document.createElement("button");
    restartButton.innerHTML = "Try Again";
    restartButton.style.position = "absolute";
    restartButton.style.top = "50%";
    restartButton.style.left = "50%";
    restartButton.style.transform = "translate(-50%, -50%)";
    restartButton.style.padding = "15px 30px";
    restartButton.style.fontSize = "20px";
    restartButton.style.backgroundColor = "black";
    restartButton.style.color = "white";
    restartButton.style.border = "none";
    restartButton.style.borderRadius = "8px";
    restartButton.style.cursor = "pointer";
    restartButton.style.display = "none";
    restartButton.onclick = restartGame;
    document.body.appendChild(restartButton);

    requestAnimationFrame(update);

    setInterval(placeCactus, 1200);
    setInterval(placeDiamond, 5000);

    document.addEventListener("keydown", moveDino);
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    if (gameOver) {
        context.fillStyle = "White";
        context.font = "50px Arial";
        context.fillText("GAME OVER", boardWidth / 2 - 150, boardHeight / 2);
        return;
    }

    let dinoImg = dinoRunImages[Math.floor(dinoFrame / 10) % 2];
    dinoFrame++;

    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            if (lives > 0) {
                lives--;
                cactusArray.splice(i, 1);
            } else {
                gameOver = true;
                restartButton.style.display = "block";
                return;
            }
        }
    }

    if (diamond) {
        diamond.x += velocityX;
        context.drawImage(diamond.img, diamond.x, diamond.y, diamond.width, diamond.height);

        if (detectCollision(dino, diamond)) {
            lives++;
            diamond = null;
        }
    }

    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText("Score: " + score, 10, 20);
    context.fillText("Lives: " + lives, 10, 50);
}

function moveDino(e) {
    if (gameOver){
        if(e.code == "Space"){
            restartGame()
        }
    }
    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        velocityY = -10;
    }
}

function placeCactus() {
    if (gameOver) return;
    let cactus = {
        img: [cactus1Img, cactus2Img, cactus3Img][Math.floor(Math.random() * 3)],
        x: cactusX,
        y: cactusY,
        width: [cactus1Width, cactus2Width, cactus3Width][Math.floor(Math.random() * 3)],
        height: cactusHeight
    }
    cactusArray.push(cactus);
}

function placeDiamond() {
    if (gameOver || diamond) return;
    diamond = { img: diamondImg, x: diamondX, y: diamondY, width: diamondWidth, height: diamondHeight };
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function restartGame() {
    gameOver = false;
    score = 0;
    lives = 1;
    dino.y = dinoY;
    velocityY = 0;
    cactusArray = [];
    diamond = null;
    restartButton.style.display = "none";
}   