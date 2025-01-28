const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// variables
let canvasUpdateInterval;
let treeCreationInterval;
let objectCreationInterval;

// time
const oneSecond = 1000;
let startTime;

// array
let trees = [];
let objects = [];
let dinosaur;

// road details
const road = {
  x: 0,
  y: canvas.height - 350,
  width: canvas.width * 2,
  height: 200,
  speed: 1,
};

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

  // Calculate the elapsed time.
  let elapsedTime;
  if (!startTime) {
    elapsedTime = 0;
  } else {
    elapsedTime = Date.now() - startTime;
  }

  // Calculate the minutes, seconds and milliseconds of the total elapsed time.
  let milliseconds = Math.floor((elapsedTime % oneSecond) / 100);
  let seconds = Math.floor(elapsedTime / oneSecond) % 60;
  let minutes = Math.floor(elapsedTime / oneSecond / 60);

  // Format the timer
  const timerText = `${minutes.toString().padStart(2, "0")}${seconds
    .toString()
    .padStart(2, "0")}${milliseconds.toString()}`;

  // Calculate the width of the text to position it correctly.
  const timerTextWidth = ctx.measureText(timerText).width;
  const textXPos = Math.max(canvas.width - timerTextWidth - 20, 20);

  // Draw the text on canvas.
  ctx.fillText(timerText, textXPos, 40);
}
drawTimer();

// CREATE TREE
function createTree() {
  const tree = {
    width: 10,
    height: Math.random() * 15 + 55,
    x: canvas.width + Math.random() * 100,
    y: 0,
  };
  if (Math.random() > 0.5) {
    tree.y = canvas.height - 350 - tree.height;
  } else {
    tree.y = canvas.height - 150;
  }
  trees.push(tree);
}
createTree();

// CREATE OBJECT
function createObject() {
  const object = {
    width: Math.random() * 10 + 20,
    height: 120,
    x: canvas.width + Math.random() * 120,
    y: 0,
  };
  if (Math.random() > 0.5) {
    object.y = canvas.height - 350;
  } else {
    object.y = canvas.height - 150 - object.height;
  }
  objects.push(object);
}
createObject();

// CREATE DINOSAUR
function createDinosaur() {
  dinosaur = {
    width: 30,
    height: 60,
    x: 150,
    y: road.y + road.height / 2 - 30,
  };
}
createDinosaur();

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
  //  type, x, y, width, height, font, fillStyle, strokeStyle, lineWidth
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
  //  type, x, y, width, height, font, fillStyle, strokeStyle, lineWidth
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
  //  type, x, y, width, height, font, fillStyle, strokeStyle, lineWidth
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
  //  type, x, y, width, height, font, fillStyle, strokeStyle, lineWidth
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
  //  type, x, y, width, height, font, fillStyle, strokeStyle, lineWidth
  if (dinosaur) {
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
}
drawRoadScene();

// START GAME
function startGameBtn() {
  startTime = Date.now();
  document.getElementById("start-game-btn").disabled = true;
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  canvasUpdateInterval = setInterval(updateCanvas, 100 / 60);
  treeCreationInterval = setInterval(createTree, 2000);
  objectCreationInterval = setInterval(createObject, 1500);
}

let isJumping = false;
let isFolding = false;

function keyDownHandler(e) {
  if (e.key === "ArrowUp" || e.key === "Up") {
    if (!isJumping && !isFolding) {
      isJumping = true;
      dinosaur.height = 60;
      setTimeout(() => {
        dinosaur.y = road.y + road.height / 2 - 30;
        isJumping = false;
      }, 500);
      dinosaur.y = Math.max(road.y, dinosaur.y - 60);
    }
  } else if (e.key === "ArrowDown" || e.key === "Down") {
    if (!isFolding) {
      isFolding = true;
      dinosaur.width = 60;
      dinosaur.height = 30;
      dinosaur.y = road.y + road.height / 2 + 50;
    }
  }
}

function keyUpHandler(e) {
  if (e.key === "ArrowDown" || e.key === "Down") {
    isFolding = false;
    dinosaur.height = 60;
    dinosaur.width = 30;
    dinosaur.y = road.y + road.height / 2 - 30;
  } else if (e.key === "ArrowUp" || e.key === "Up") {
    isJumping = false;
    dinosaur.y = road.y + road.height / 2 - 30;
  }
}

// UPDATE CANVAS
function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTimer();
  road.x -= road.speed;
  if (road.x <= -canvas.width) {
    road.x = 0;
  }
  drawRoadScene();
}
