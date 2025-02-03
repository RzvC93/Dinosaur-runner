const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// constants
const oneSecond = 1000;
const TEN = 10;
const TWENTY = 20;
const THIRTY = 30;
const FORTY = 40;
const SIXTY = 60;
const ONE_HUNDRED = 100;
const ONE_HUNDRED_TWENTY = 120;
const ONE_HUNDRED_FIFTY = 150;
const TWO_HUNDRED = 200;
const TWO_HUNDRED_FIFTY = 250;
const roadTopMargin = 350;
const ONE_THOUSAND = 1000;
const ONE_THOUSAND_FIVE_HUNDRED = 1500;

// variables
let canvasUpdateInterval;
let treeCreationInterval;
let objectCreationInterval;
let startTime;
let bestScore = 0;

// array
const trees = [];
const objects = [];

// road details
const road = {
  x: 0,
  y: canvas.height - roadTopMargin,
  width: canvas.width * 2,
  height: TWO_HUNDRED,
  speed: 1,
};

// dinosaur details
const dinosaur = {
  width: THIRTY,
  height: SIXTY,
  x: ONE_HUNDRED_FIFTY,
  y: road.y + road.height / 2 - THIRTY,
};

// game over and status of dinosaur actions
let gameOver = false;
let isJumping = false;
let isFolding = false;

// style
function setStyle(font, fillStyle, strokeStyle, lineWidth) {
  if (font) {
    ctx.font = font;
  }
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
  }
  if (lineWidth) {
    ctx.lineWidth = lineWidth;
  }
}

// TIMER
function drawTimer() {
  setStyle("30px bold Permanent Marker", "black", null, null);
  let elapsedTime;
  if (!startTime) {
    elapsedTime = 0;
  } else {
    elapsedTime = Date.now() - startTime;
  }
  let milliseconds = Math.floor((elapsedTime % oneSecond) / ONE_HUNDRED);
  let seconds = Math.floor(elapsedTime / oneSecond) % SIXTY;
  let minutes = Math.floor(elapsedTime / oneSecond / SIXTY);
  const timerText = `${minutes.toString().padStart(2, "0")}${seconds
    .toString()
    .padStart(2, "0")}${milliseconds.toString()}`;
  const timerTextWidth = ctx.measureText(timerText).width;
  const textXPos = Math.max(canvas.width - timerTextWidth - TWENTY, TWENTY);
  ctx.fillText(timerText, textXPos, FORTY);
}
drawTimer();

// BEST SCORE
function displayBestScore() {
  const scoreTextWidth = ctx.measureText(`HI: 000000`).width;
  const bestScoreXPos = canvas.width - scoreTextWidth - 150;

  ctx.clearRect(bestScoreXPos - TWENTY, 0, scoreTextWidth + FORTY, FORTY);

  setStyle("30px bold Permanent Marker", "black", null, null);
  let milliseconds = Math.floor((bestScore % oneSecond) / ONE_HUNDRED);
  let seconds = Math.floor(bestScore / oneSecond) % SIXTY;
  let minutes = Math.floor(bestScore / oneSecond / SIXTY);

  const scoreText = `HI: ${minutes.toString().padStart(2, "0")}${seconds
    .toString()
    .padStart(2, "0")}${milliseconds.toString()}`;
  ctx.fillText(scoreText, bestScoreXPos, FORTY);
}
displayBestScore();

// CREATE ELEMENT
function createElement(list, width, height, yValues) {
  let x = canvas.width + Math.random() * ONE_HUNDRED;
  let y = yValues[Math.floor(Math.random() * yValues.length)];
  list.push({ width, height, x, y });
}

// DRAW SHAPE
function drawShape(
  type,
  x,
  y,
  width,
  height,
  font,
  fillStyle,
  strokeStyle,
  lineWidth
) {
  setStyle(font, fillStyle, strokeStyle, lineWidth);
  ctx.beginPath();
  if (type == "rect") {
    ctx.rect(x, y, width, height);
    ctx.fill();
  } else if (type == "line") {
    ctx.moveTo(x, y);
    ctx.lineTo(width, height);
  }
  ctx.stroke();
  ctx.closePath();
}

// DRAW ROAD SCENE
function drawRoadScene() {
  // draw road
  drawShape(
    "rect",
    road.x,
    road.y,
    road.width,
    road.height,
    null,
    "black",
    "gray",
    4
  );

  // draw line
  drawShape(
    "line",
    road.x,
    road.y + road.height / 2,
    road.x + road.width * 2,
    road.y + road.height / 2,
    null,
    null,
    "white",
    4
  );

  // draw trees
  for (let i = 0; i < trees.length; ++i) {
    if (trees[i].x + trees[i].width < 0) {
      trees.splice(i, 1);
      --i;
    } else {
      trees[i].x -= 1;
      drawShape(
        "rect",
        trees[i].x,
        trees[i].y,
        trees[i].width,
        trees[i].height,
        null,
        "green",
        "brown",
        1
      );
    }
  }

  // draw objects
  for (let i = 0; i < objects.length; ++i) {
    if (objects[i].x + objects[i].width < 0) {
      objects.splice(i, 1);
      --i;
    } else {
      objects[i].x -= 1;
      drawShape(
        "rect",
        objects[i].x,
        objects[i].y,
        objects[i].width,
        objects[i].height,
        null,
        "red",
        "white",
        1
      );
    }
  }

  // draw dinosaur
  drawShape(
    "rect",
    dinosaur.x,
    dinosaur.y,
    dinosaur.width,
    dinosaur.height,
    null,
    "blue",
    "white",
    1
  );
}

drawRoadScene();

function keyDownHandler(e) {
  if (e.key === "ArrowUp" || e.key === "Up") {
    if (!isJumping) {
      isJumping = true;
      dinosaur.height = SIXTY;
      dinosaur.y = Math.max(road.y, dinosaur.y - SIXTY);
      setTimeout(() => {
        dinosaur.y = road.y + road.height / 2 - THIRTY;
        isJumping = false;
      }, ONE_THOUSAND);
    }
  } else if (e.key === "ArrowDown" || e.key === "Down") {
    if (!isFolding) {
      isFolding = true;
      dinosaur.width = SIXTY;
      dinosaur.height = THIRTY;
      dinosaur.y = road.y + road.height / 2 + SIXTY;
    }
  }
}

function keyUpHandler(e) {
  if (e.key === "ArrowDown" || e.key === "Down") {
    isFolding = false;
    dinosaur.height = SIXTY;
    dinosaur.width = THIRTY;
  } else if (e.key === "ArrowUp" || e.key === "Up") {
    isJumping = false;
  }
  dinosaur.y = road.y + road.height / 2 - THIRTY;
}

// UPDATE CANVAS
function updateCanvas() {
  if (gameOver) {
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime > bestScore) {
      bestScore = elapsedTime;
    }

    clearInterval(canvasUpdateInterval);
    clearInterval(treeCreationInterval);
    clearInterval(objectCreationInterval);

    setStyle("30px bold Permanent Marker", "black", null, null);
    const textWidth = ctx.measureText("GAME OVER").width;
    ctx.fillText(
      "GAME OVER",
      (canvas.width - textWidth) / 2,
      canvas.height / 2
    );

    displayBestScore();

    const startButton = document.getElementById("start-game-btn");
    startButton.disabled = false;
    startButton.textContent = "Restart Game";

    function restartOnKeyPress(e) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        restartGame();
        startButton.disabled = true;
        startButton.textContent = "Start Game";
        document.removeEventListener("keydown", restartOnKeyPress);
      }
    }
    document.addEventListener("keydown", restartOnKeyPress);
    return;
  }

  // if game is not over
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTimer();

  road.x -= road.speed;
  if (road.x <= -canvas.width) {
    road.x = 0;
  }

  drawRoadScene();

  for (let i = 0; i < objects.length; ++i) {
    if (checkCollision(dinosaur, objects[i])) {
      gameOver = true;
    }
  }

  displayBestScore();
}

// CHECK COLLISION
function checkCollision(dinosaur, object) {
  return (
    dinosaur.x < object.x + object.width &&
    dinosaur.x + dinosaur.width > object.x &&
    dinosaur.y < object.y + object.height &&
    dinosaur.y + dinosaur.height > object.y
  );
}

// START GAME
function startGameBtn() {
  startTime = Date.now();
  document.getElementById("start-game-btn").disabled = true;
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  canvasUpdateInterval = setInterval(updateCanvas, ONE_HUNDRED / SIXTY);
  treeCreationInterval = setInterval(() => {
    createElement(trees, 5, ONE_HUNDRED, [
      canvas.height - roadTopMargin - ONE_HUNDRED,
      canvas.height - ONE_HUNDRED_FIFTY,
    ]);
  }, ONE_THOUSAND);

  objectCreationInterval = setInterval(() => {
    createElement(objects, Math.random() * TEN + TWENTY, ONE_HUNDRED_TWENTY, [
      canvas.height - roadTopMargin,
      canvas.height - ONE_HUNDRED_FIFTY - ONE_HUNDRED_TWENTY,
    ]);
  }, ONE_THOUSAND_FIVE_HUNDRED);
}

// RESTART GAME
function restartGame() {
  gameOver = false;
  startTime = Date.now();
  trees.length = 0;
  objects.length = 0;
  road.x = 0;
  dinosaur.y = road.y + road.height / 2 - THIRTY;
  isJumping = false;
  isFolding = false;

  startGameBtn();
}
