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
let bulletSpeed = 5;
let bullets = [];

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
  spaceShip.x += 1;
}

//This `setup` function will run when the image has loaded
function setup() {
  app.ticker.add(delta => gameLoop(delta));

  //Create the cat sprite
  let spaceShip = new Sprite(resources["/assets/spaceship.png"].texture);

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

  let star = new Sprite(resources["/assets/star.png"].texture);

  //Change the sprite's position
  const starRatio = (Scale.unit * 16) / 204;
  star.scale.set(starRatio, starRatio);
  star.x = Scale.width / 1;
  star.y = Scale.height / 1;
  star.anchor.set(9, 9);
  star.rotation = 0;

  star.vx = 0;
  star.vy = 0;
  star.hp = 10;

  //Add the spaceship to the stage
  app.stage.addChild(star);
  //Start the game loop by adding the `gameLoop` function to
  //Pixi's `ticker` and providing it with a `delta` argument.
}
