var canvas = document.getElementById("area");
var context = canvas.getContext("2d");
var mouseX = 0;
var mouseY = 0;
var gravity = 4;
var clickDuration = 1;
var points = 0;
var arrowState = 0; // 0 - not moving /    1 - Moving
let timer = null;
canvas.height = window.innerHeight;
canvas.width = 920;

let gravityLabel;
let pointsLabel;

let arrowMovement;
let target4 = new Target(10, canvas.height / 2 , canvas.width - 20, canvas.height / 4, "black");
let target6 = new Target(10, canvas.height / 3, canvas.width - 20, canvas.height / 3, "blue");
let target8 = new Target(10, canvas.height / 6, canvas.width - 20, canvas.height / 2.4, "yellow");
let target10 = new Target(10, canvas.height / 15, canvas.width - 20, canvas.height / 2.15, "red");

let bow = new Bow(60, canvas.height / 2, canvas.height / 25);
let arrow = new Arrow(60, canvas.height / 2 , 60, 2);

window.onload = () => {
  gravityLabel = document.getElementById("gravity");
  gravityLabel.innerText = "Gravity: " + gravity;

  pointsLabel = document.getElementById("points");
}

//Objects----------------------------------------------------------
//args order = width, height, x, y, color
function Target(...args){
  this.width = args[0];
  this.height = args[1];
  this.x = args[2];
  this.y = args[3];
  this.color = args[4];
  context = context;
  context.fillStyle = args[4];
  context.fillRect(this.x, this.y, this.width, this.height);
}

function Bow(x, y, radius) {
  this.x = x;
  this.y = y;
  this.rotate = (degrees) => {
    context.clearRect(0, 0, x + 70, canvas.height);
    context.save();
    
    context.translate(x+30, y+2);
    context.rotate(degrees * Math.PI/180);

    context.beginPath();
    context.arc(-20, 0, radius, -Math.PI/2, Math.PI/2);
    context.stroke();

    context.beginPath();
    context.moveTo(-20, 0 - radius);
    context.lineTo(-20, 0 + radius);
    context.stroke();

    context.restore();
  }

  context.beginPath();
  context.arc(x, y, radius, -Math.PI/2, Math.PI/2);
  context.stroke();

  context.beginPath();
  context.moveTo(-20, 0 - radius);
  context.lineTo(-20, 0 + radius);
  context.stroke();

  requestAnimationFrame(Bow);
}

function Arrow(x, y, width, height, angle = 0){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.angle = angle;

  this.rotate = (degrees) => {
    this.angle = degrees;
    if(arrowState == 1){
      context.clearRect(x - 10, y  - 100 , x + width + 1, y + 100);
    }
    context.save();
    context.translate(x + 30, y + 2);
    context.rotate(degrees * Math.PI / 180);
    //-30, -1, 60, 2, 

    context.fillStyle = "black";
    context.fillRect(-30, -1, width, height);

    context.restore();
  }
  context.rotate(angle * Math.PI / 180);
  context.fillStyle = "black";
  context.fillRect(x, y, width, height);
  requestAnimationFrame(Arrow);
}
//------------------------------------------------------

//Events-------------------------------------------------
canvas.addEventListener("mousemove", (e) => {
  if(arrowState == 0){
    mouseY = e.clientY;
    mouseX = e.clientX;
    let degrees = ((canvas.height/2 - mouseY) * (-90) / canvas.height);
    bow.rotate(degrees);
    arrow.rotate(degrees);
  }
}, false);


document.addEventListener("keydown", (e) => {
  if(arrowState == 0){
    if(e.code == "Space"){
      timer = setTimeout(() => {
        clickDuration += 100;
      }, 100);
    }
  }
});

document.addEventListener("keyup", (e) => {
  if(arrowState == 0){
    if(e.code == "Space"){
      clearTimeout(timer);
      shootArrow(clickDuration);
      clickDuration = 1;
      timer = null;
    }
  }
});
//---------------------------------------------



function shootArrow(force) {
  arrowState = 1;
  force  = force >= 4000 ? 4000 : force;
  arrowMovement = setInterval(() =>{
    let speed = force / 100;
    let previousAngle = arrow.angle;
    context.clearRect(arrow.x - 10, arrow.y  - 100 , arrow.x + arrow.width + 1, arrow.y + 100);
    arrow = new Arrow(arrow.x + speed, arrow.y + (previousAngle / 15) * gravity, arrow.width, arrow.height);
    arrow.rotate(previousAngle + 10 / (gravity *2));

    target4 = new Target(10, canvas.height / 2 , canvas.width - 20, canvas.height / 4, "black");
    target6 = new Target(10, canvas.height / 3, canvas.width - 20, canvas.height / 3, "blue");
    target8 = new Target(10, canvas.height / 6, canvas.width - 20, canvas.height / 2.4, "yellow");
    target10 = new Target(10, canvas.height / 15, canvas.width - 20, canvas.height / 2.15, "red");

    let collided = checkCollision(target10.x);

    if(collided) {
      clearInterval(arrowMovement);
      arrowState = 0;
      arrowMovement = null;
      reset(target10, target8, target6, target4);
    }

  }, 20);
}

function checkCollision(target){
  if(arrow.y + arrow.height >= canvas.height){
    return true;
  } else if(arrow.x + arrow.width >= target){  
      return true;
  } else{
    return false;
  }
}
function countPoints(targets){
  for(let target of targets){
    if(target.y <= arrow.y + Math.abs(arrow.angle) && target.y + target.height > arrow.y + Math.abs(arrow.angle)){
      switch (target) {
        case target10:
          return 10;
        case target8:
          return 8;
        case target6:
          return 6;
        case target4:
          return 4;
      }
    }
  }
  return 0;
}


function reset(...targets){
  points += countPoints(targets);
  console.log(countPoints(targets));
  pointsLabel.innerText = "Points: " + points;
  bow = new Bow(60, canvas.height / 2, canvas.height / 25);
  arrow = new Arrow(60, canvas.height / 2 , 60, 2);
  gravity = (Math.random() * (10 - 3)) + 3;
  gravityLabel.innerText = "Gravity: " + Math.floor(gravity);
}

