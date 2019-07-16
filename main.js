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

// Global varaibles
let spaceShip, id, star, astroid;

//Holder array variables
let ground = [];
let houses = [];
let stars = [];
let bullets = [];
let astroids = [];

//Aliases
let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({
  width: clientm * 1.0,
  height: clientm * 1.0,
  antialias: true,
  transparent: false,
  autoDensity: true,
  backgroundColor: 0
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.getElementById("playfield").appendChild(app.view);

//load an image and run the `setup` function when it's done//LOADER
loader
  .add(["/assets/spaceship.png", "/assets/star.png", "/assets/astroid.png"])
  .load(setup);

//GAMELOOP
function gameLoop(delta) {
  // this is a workaround to enforce z ordering
  // the player should be rendered above all particles
  // remove the player
  // add the player
  app.stage.removeChild(spaceShip);
  app.stage.addChild(spaceShip);
  state(delta);
}
/////////////////////////////////////////////PLAY!!!!!!!
function play(delta) {
  //Use the spaceships velocity to make it move
  spaceShip.x += spaceShip.vx;
  spaceShip.y += spaceShip.vy;

  moveStars();
  moveAstroids();
  spawnAstroids();

  contain(spaceShip, {
    x: 10,
    y: 10,
    width: Scale.width,
    height: Scale.height
  });

  for (let i = 0; i < astroids.length; i++) {
    astroid = astroids[i];
    if (bullets.length !== 0) {
      for (let j = 0; j < bullets.length; j++) {
        bullet = bullets[j];
        if (hitTestRectangle(spaceShip, astroid)) {
          spaceShip.hp--;
          astroid.tint = 0xff3300;
          spaceShip.tint = 0xff3300;
          spaceShip.x -= spaceShip.vx * Scale.unit;
          spaceShip.y -= spaceShip.vy * Scale.unit;
        } else if (hitTestRectangle(bullet, astroid)) {
          astroid.hp--;
          astroid.tint = 0xff3300;
          spaceShip.tint = 0xff3300;
          bullet.hp--;
          if (bullet.hp === 0) {
            app.stage.removeChild(bullet);
            bullet.x = 0;
            bullet.y = 0;
          }
          if (astroid.hp === 0) {
            app.stage.removeChild(astroid);
            astroids[i].x = 0;
            astroids[i].y = 0;
          }
        } else {
          astroid.tint = 0xccff99;
          spaceShip.tint = 0xccff99;
        }
      }
    } else if (hitTestRectangle(spaceShip, astroid)) {
      astroid.tint = 0xff3300;
      spaceShip.tint = 0xff3300;
      spaceShip.hp--;
      if (spaceShip.hp === 0) {
        console.log(spaceShip.hp);
        app.stage.removeChild(spaceShip);
        spaceShip.x = 0;
        spaceShip.y = 0;
      }
    } else {
      astroid.tint = 0xccff99;
      spaceShip.tint = 0xccff99;
    }
  }
}

//This `setup` function will run when the image has loaded//////SETUP
function setup() {
  state = play;
  app.ticker.add(delta => gameLoop(delta));

  //Create the spaceShip sprite
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
  spaceShip.hp = 2;

  //Add the spaceship to the stage
  app.stage.addChild(spaceShip);

  //Create Stars
  let starSprite = new PIXI.Texture.fromImage("/assets/star.png");
  let numberOfStars = 100,
    spacing = 48,
    xOffset = 150,
    speed = 2,
    direction = 1;

  //Change the sprite's position
  for (let i = 0; i < numberOfStars; i++) {
    star = new Sprite(starSprite);
    let x = spacing * i + xOffset;
    // let y = randomInt(0, app.stage.height - star.height);
    const starRatio = (Scale.unit * 8) / 204;
    star.scale.set(0.08 + Math.random() * 0.8);
    star.x = Math.floor(Math.random() * app.screen.width);
    star.y = Math.floor(Math.random() * app.screen.height);
    star.anchor.set(0.5, 0.5);
    //star.rotation = 0;
    star.vy = speed * direction;
    //star.vy = 0;
    star.tint = Math.random() * 0xffffff;
    // create some extra properties that will control movement :
    // create a random direction in radians. This is a number between 0 and PI*2 which is the equivalent of 0 - 360 degrees
    star.direction = Math.random() * Math.PI * 2;
    // this number will be used to modify the direction of the dude over time
    star.turningSpeed = Math.random() - 0.8;
    // create a random speed for the dude between 0 - 2
    star.speed = 2 + Math.random() * 2;
    // finally we push the stars into the array so it it can be easily accessed later
    stars.push(star);
    //Add the star to the stage
    app.stage.addChild(star);
  }
}

//Create Astroids
let astroidSprite = new PIXI.Texture.fromImage("/assets/astroid.png");
let numberOfAstroids = 2,
  spacing = 48,
  xOffset = 150,
  speed = 2,
  direction = 1;

//Change the sprite's position
for (let i = 0; i < numberOfAstroids; i++) {
  astroid = new Sprite(astroidSprite);
  let x = spacing * i + xOffset;
  // let y = randomInt(0, app.stage.height - star.height);
  const astroidRatio = (Scale.unit * 2) / 204;
  astroid.scale.set(0.08 + Math.random() * 0.8);
  astroid.x = Math.floor(Math.random(10) * app.screen.width);
  astroid.y = Math.floor(Math.random(10) * app.screen.height);
  astroid.anchor.set(0.5, 0.5);
  //astroid.rotation = 0;
  astroid.vy = speed * direction;
  astroid.hp = 1;
  //astroid.vy = 0;
  astroid.direction = Math.random() * Math.PI * 2;
  // this number will be used to modify the direction of the dude over time
  astroid.turningSpeed = Math.random() - 0.8;
  // create a random speed for the dude between 0 - 2
  astroid.speed = 2 + Math.random() * 2;
  // finally we push the stars into the array so it it can be easily accessed later
  astroids.push(astroid);
  //Add the astroid to the stage
  app.stage.addChild(astroid);
}

const astroidsSpawnCounterLimit = 30;
let astroidsSpawnCounter = 0;

//Spawning Astroids are not working! --NEED TO LOOK AT!
function spawnAstroids() {
  // disable spawning of particles until player moves
  if (spaceShip.vx === 0.0 && spaceShip.vy === 0) {
    return;
  }

  // slow down spawning of particles based on frame count
  astroidsSpawnCounter += 1;
  if (astroidsSpawnCounter < astroidsSpawnCounterLimit) {
    return;
  } else {
    astroidsSpawnCounter = 0;
  }

  for (let index = 0; index < astroids; index++) {
    // create an alias
    const astroid = astroids[index];

    if (astroid.parent === null) {
      // setup this particle

      let pstart = [];
      let pend = [];

      if (0.5 <= Math.random()) {
        // x axis
        if (0.5 <= Math.random()) {
          pstart[0] = vm.xmin;
          pend[0] = vm.xmax;
        } else {
          pstart[0] = vm.xmax;
          pend[0] = vm.xmin;
        }

        pstart[1] = vm.ymin + (vm.ymax - vm.ymin) * Math.random();
        pend[1] = vm.ymin + (vm.ymax - vm.ymin) * Math.random();
      } else {
        // y axis
        if (0.5 <= Math.random()) {
          pstart[1] = vm.ymin;
          pend[1] = vm.ymax;
        } else {
          pstart[1] = vm.ymax;
          pend[1] = vm.ymin;
        }

        pstart[0] = vm.xmin + (vm.xmax - vm.xmin) * Math.random();
        pend[0] = vm.xmin + (vm.xmax - vm.xmin) * Math.random();
      }

      const pvelocity = vec2Normalize(vec2Direction(pstart, pend));

      astroid.x = pstart[0];
      astroid.y = pstart[1];

      astroid.vx = pvelocity[0];
      astroid.vy = pvelocity[1];

      // aim astroid
      aimSprite(astroid, pvelocity);
      // add to container
      app.stage.addChild(astroid);
      // we're done
      break;
    }
  }
}

//Move Astroids!
function moveAstroids(step) {
  step = 1;
  //Moving Astroids
  astroids.forEach(function(astroid, i) {
    // astroid.y += astroid.vy;
    //Check the astroids screen boundaries
    let astroidHitsWall = contain(astroid, {
      x: 0,
      y: 0,
      width: Scale.width,
      height: Scale.height
    });
    //Move the astoirds
    if (astroid.parent !== null) {
      // astroid.x = astroid.x + astroid.vx * step;
      astroid.y = astroid.y + astroid.vy * step;
      //If the astroid hits the bottom of the stage, remove astoird
      //its direction
      if (astroidHitsWall === "bottom") {
        //app.stage.removeChild(astroid);
        astroid.x = Math.ceil(Math.random() * app.screen.width);
        astroid.y = Math.ceil(Math.random() * app.screen.height);
      }
    }
    //Test for a collision. If any of the enemies are touching
    //the explorer, set `explorerHit` to `true`
  });
}

function moveStars(step) {
  //Moving of Stars
  stars.forEach(function(star) {
    //Move the stars
    star.y += star.vy;
    //Check the stars screen boundaries
    let starHitsWall = contain(star, {
      x: 0,
      y: 0,
      width: Scale.width,
      height: Scale.height
    });

    //If the star hits the  bottom of the stage, Math random it.
    //its direction
    if (starHitsWall === "bottom") {
      star.x = Math.ceil(Math.random() * app.screen.width);
      star.y = Math.ceil(Math.random() * app.screen.height);
    }
  });
}
//Create the bullet
app.stage.interactive = true;
let bulletSprite = new PIXI.Texture.fromImage("/assets/bullet.png");
let bulletSpeed = 5;

//shoot bullets
function shoot(rotation, startPosition) {
  bullet = new PIXI.Sprite(bulletSprite);
  //console.log(bullet);
  const bulletRatio = (Scale.unit * 22) / 256;
  bullet.scale.set(bulletRatio, bulletRatio);
  bullet.position.y = startPosition.y;
  bullet.position.x = startPosition.x;
  bullet.rotation = rotation - 1.6;
  bullet.anchor.set(0.5, 0.8);
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

//KEYBOARD Functions presses.////////////////////////////////////////////////////////////////
let downListener = event => {
  if (event.code === "KeyW") {
    if (spaceShip.vy > -1) {
      spaceShip.vy -= 4.5;
      spaceShip.vx = 0;
      spaceShip.rotation = 0;
    }
  }
  if (event.code === "KeyA") {
    if (spaceShip.vx > -1) {
      spaceShip.vx -= 4.5;
      spaceShip.vy = 0;
      spaceShip.rotation = 0;
    }
  }
  if (event.code === "KeyS") {
    if (spaceShip.vy < 1) {
      spaceShip.vy += 4.5;
      spaceShip.vx = 0;
      spaceShip.rotation = 0;
    }
  }
  if (event.code === "KeyD") {
    if (spaceShip.vx < 1) {
      spaceShip.vx += 3.5;
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

//Helper Functions/////////////////////////////////////////////////////////////////////

function contain(sprite, container) {
  let collision = undefined;

  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
}

function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}

//spriteCollision helper func that checks for sprite boundaries
function spriteCollision(sprite, object) {
  let collision = undefined;

  //Left
  if (sprite.x < object.x) {
    sprite.vx = 0;
    //sprite.x = object.x;
    collision = "left";
  }

  //Top
  if (sprite.y < object.y) {
    sprite.vy = 0;
    //sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > object.width) {
    sprite.vx = 0;
    //sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > object.height) {
    sprite.vy = 0;
    //sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
}

function checkHp(sprite) {
  console.log("in the helper function");
  if (sprite.hp === 0) {
    return 0;
  } else {
    return sprite.hp;
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
