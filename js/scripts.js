var canvas = document.getElementById("area");
var context = canvas.getContext("2d");
var mouseX = 0;
var mouseY = 0;
var gravity = 10;
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let target4 = new Target(10, canvas.height / 2 , canvas.width - 20, canvas.height / 4, "black");
let target6 = new Target(10, canvas.height / 3, canvas.width - 20, canvas.height / 3, "blue");
let target8 = new Target(10, canvas.height / 6, canvas.width - 20, canvas.height / 2.4, "yellow");
let target10 = new Target(10, canvas.height / 15, canvas.width - 20, canvas.height / 2.15, "red");

let bow = new Bow(60, canvas.height / 2, canvas.height / 25);

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
  console.log(this);
}

function Bow(x, y, radius) {
  this.x = x;
  this.y = y;
  this.rotate = (degrees) => {
    context.clearRect(0, 0, x + 70, canvas.height);
    context.save();
    
    context.translate(x+30, y+2);
    context.rotate(degrees * Math.PI/180);

    context.fillStyle = "black";
    context.fillRect(-30, -1, 60, 2);

    context.beginPath();
    context.arc(-20, 0, radius, -Math.PI/2, Math.PI/2);
    context.stroke();

    context.beginPath();
    context.moveTo(-20, 0 - radius);
    context.lineTo(-20, 0 + radius);
    context.stroke();

    context.restore();
  }

  context.fillStyle = "black";
  context.fillRect(x, y, 60, 2);

  context.beginPath();
  context.arc(x, y, radius, -Math.PI/2, Math.PI/2);
  context.stroke();

  context.beginPath();
  context.moveTo(-20, 0 - radius);
  context.lineTo(-20, 0 + radius);
  context.stroke();

  requestAnimationFrame(Bow);
}

//Events
canvas.addEventListener("mousemove", (e) => {
  mouseY = e.clientY;
  mouseX = e.clientX;
  bow.rotate(((canvas.height/2 - mouseY) * (-90) / canvas.height));
}, false);



canvas.addEventListener("mousedown", (e) => {

})

