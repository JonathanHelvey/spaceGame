const clientw = Math.max(
  document.documentElement.clientWidth,
  window.innerWidth || 0
);
const clienth = Math.max(
  document.documentElement.clientHeight,
  window.innerHeight || 0
);
const clientm = Math.min(clientw, clienth);

let Scale = {
  width: clientm * 0.9,
  height: clientm * 0.9,
  unit: (clientm * 0.9) / 256
};

//Holder array variables
let ground = [];
let houses = [];

//Aliases
let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({
  width: Scale.width,
  height: Scale.height,
  antialias: true,
  transparent: false,
  autoDensity: true,
  backgroundColor: 0
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.getElementById("playfield").appendChild(app.view);

let spaceShip, id, star;

//load an image and run the `setup` function when it's done
loader.add(["/assets/spaceship.png", "/assets/star.png"]).load(setup);

function gameLoop(delta) {
  //Move the cat 1 pixel
  //spaceShip.x += 1;
  state(delta);
}

function play(delta) {
  //Use the cat's velocity to make it move
  spaceShip.x += spaceShip.vx;
  spaceShip.y += spaceShip.vy;
}

//This `setup` function will run when the image has loaded
function setup() {
  state = play;
  app.ticker.add(delta => gameLoop(delta));

  //Create the cat sprite
  let spaceShipSprite = new PIXI.Texture.fromImage("/assets/spaceship.png");
  spaceShip = new Sprite(spaceShipSprite);
  //console.log(spaceShip);
  //Change the sprite's position
  const spaceShipRatio = (Scale.unit * 16) / 204;
  spaceShip.scale.set(spaceShipRatio, spaceShipRatio);
  spaceShip.x = Scale.width / 2;
  spaceShip.y = Scale.height / 2;
  spaceShip.anchor.set(0.5, 0.5);
  spaceShip.rotation = 0;

  spaceShip.vx = 0;
  spaceShip.vy = 0;
  spaceShip.hp = 10;

  //Add the spaceship to the stage
  app.stage.addChild(spaceShip);

  let starSprite = new PIXI.Texture.fromImage("/assets/star.png");
  let stars = [];
  //Change the sprite's position
  for (let i = 0; i < 100; i++) {
    star = new Sprite(starSprite);
    const starRatio = (Scale.unit * 4) / 204;
    star.scale.set(starRatio, starRatio);
    star.x = Math.floor(Math.random() * 500 + 1);
    star.y = Math.floor(Math.random() * 500 + 1);
    star.anchor.set(0.5, 0.5);
    star.rotation = 0;
    star.vx = 0;
    star.vy = 0;
    stars.push(star);
    //Add the spaceship to the stage
    app.stage.addChild(star);
  }
  //Start the game loop by adding the `gameLoop` function to
  //Pixi's `ticker` and providing it with a `delta` argument.
}

//Create the bullet
app.stage.interactive = true;
let bulletSprite = new PIXI.Texture.fromImage("/assets/bullet.png");
let bulletSpeed = 5;
let bullets = [];

//shoot bullets
function shoot(rotation, startPosition) {
  bullet = new PIXI.Sprite(bulletSprite);
  //console.log(bullet);
  const bulletRatio = (Scale.unit * 22) / 256;
  bullet.scale.set(bulletRatio, bulletRatio);
  bullet.position.y = startPosition.y;
  bullet.position.x = startPosition.x;
  bullet.rotation = rotation - 1.6;
  bullet.anchor.set(0.5, 1);
  bullet.hp = 1;
  bullets.push(bullet);
  app.stage.addChild(bullet);
}

function rotateToPoint(mx, my, px, py) {
  var dist_Y = my - py;
  var dist_X = mx - px;
  var angle = Math.atan2(dist_Y, dist_X);
  return angle;
}
// start animating
function animate() {
  requestAnimationFrame(animate);
  for (var b = bullets.length - 1; b >= 0; b--) {
    bullets[b].position.x += Math.cos(bullets[b].rotation) * bulletSpeed;
    bullets[b].position.y += Math.sin(bullets[b].rotation) * bulletSpeed;
  }
}

animate();

//KEYBOARD Functions presses.
let downListener = event => {
  if (event.code === "KeyW") {
    if (spaceShip.vy > -1) {
      spaceShip.vy -= 2.5;
      spaceShip.vx = 0;
      spaceShip.rotation = 0;
    }
  }
  if (event.code === "KeyA") {
    if (spaceShip.vx > -1) {
      spaceShip.vx -= 2.5;
      spaceShip.vy = 0;
      spaceShip.rotation = 0;
    }
  }
  if (event.code === "KeyS") {
    if (spaceShip.vy < 1) {
      spaceShip.vy += 2.5;
      spaceShip.vx = 0;
      spaceShip.rotation = 0;
    }
  }
  if (event.code === "KeyD") {
    if (spaceShip.vx < 1) {
      spaceShip.vx += 2.5;
      spaceShip.vy = 0;
      spaceShip.rotation = 0;
    }
  }
  if (event.code === "Space") {
    shoot(spaceShip.rotation, {
      x: spaceShip.position.x + Math.cos(spaceShip.rotation) * 20,
      y: spaceShip.position.y + Math.sin(spaceShip.rotation) * 20
    });
  }
};

let upListener = event => {
  if (event.code === "KeyW") {
    spaceShip.vy = 0;
  }
  if (event.code === "KeyA") {
    spaceShip.vx = 0;
  }
  if (event.code === "KeyS") {
    spaceShip.vy = 0;
  }
  if (event.code === "KeyD") {
    spaceShip.vx = 0;
  }
};
window.addEventListener("keydown", downListener, false);

window.addEventListener("keyup", upListener, false);
