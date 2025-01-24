const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//
let canvasUpdateInterval;

// time
const oneSecond = 1000;
let startTime;

// TIMER
function drawTimer() {
  ctx.font = "30px bold Permanent Marker";
  ctx.fillStyle = "black";

  const elapsedTime = startTime ? Date.now() - startTime : 0;
  // If startTime has a value, the variable elapsedTime will be given the value Date.now() - startTime.
  // If startTime does not have a value, elapsedTime will be given the value 0. it shows 00000 before start

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

function drawRoad() {
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 4;
  ctx.rect(0, canvas.height - 350, canvas.width, 200);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;
  ctx.moveTo(0, canvas.height - 350 + 200 / 2);
  ctx.lineTo(canvas.width, canvas.height - 350 + 200 / 2);
  ctx.stroke();
  ctx.closePath();
}
drawRoad();

// START GAME
function startGameBtn() {
  startTime = Date.now();
  document.getElementById("start-game-btn").disabled = true;
  canvasUpdateInterval = setInterval(updateCanvas, 100 / 60);
}

// UPDATE CANVAS
function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTimer();
  drawRoad();
}
