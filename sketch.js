const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg, boat;
var canvas, angle, tower, ground, cannon;
var balls = [];
var boats = [];
var brokenboatgif, brokenboatjson;
var brokenboatimages = [];
var normalboatgif, normalboatjson;
var normalboatimages = [];

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  brokenboatgif = loadImage("assets/broken-ship-01.gif");
  brokenboatjson = loadJSON("assets/brokenboats.json");
  normalboatgif = loadImage("assets/normalboat.png");
  normalboatjson = loadJSON("assets/normalboat.json");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);
  angle = 15;

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);

  rect(ground.position.x, ground.position.y, width * 2, 1);

  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  showBoats();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    check_collision_with_boat(i);
  }

  cannon.display();
  var brokenboatframes = brokenboatjson.frames;
  for (let i = 0; i < brokenboatframes.length; i++) {
    var pos = brokenboatframes[i].position;
    var img = brokenboatgif.get(pos.x, pos.y, pos.w, pos.h);
    brokenboatimages.push(img);
  }
  var normalboatframes = normalboatjson.frames;
  for (let i = 0; i < normalboatframes.length; i++) {
    var pos = normalboatframes[i].position;
    var img = normalboatgif.get(pos.x, pos.y, pos.w, pos.h);
    normalboatimages.push(img);
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display();
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (
      boats[boats.length - 1] === undefined ||
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(width, height - 100, 170, 170, position,normalboatimages );

      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, {
          x: -0.9,
          y: 0,
        });

        boats[i].display();
      }
    }
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -60,normalboatimages);
    boats.push(boat);
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }
}

function check_collision_with_boat(index) {
  for (let i = 0; i < boats.length; i++) {
    if (balls[index] != undefined && boats[i] != undefined) {
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);
      if (collision.collided) {
        Matter.World.remove(world, balls[index].body);
        delete balls[index];
        boats[i].remove(i);
      }
    }
  }
}
