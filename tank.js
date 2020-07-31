/* global p5 */

// DO NOT EDIT THE FOLLOWING LINE
const p = new p5(() => {});

let inLoading, inGame, inEnd, inChoice; //parameters that control which game screen you are in
let width = 800;
let height = 600;
let red, blue, white, green;//variables for color
let heart, birdImages;//variables for images
let birds, tank1, tank2, shooter1, shooter2, missile;
let v1, v2, v4, v5; //vectors to measure tank1's angle
let powerups;//array for powerups
let isReleased, round1, round2, choseTank, chosePower;//booleans
let tanks;
const time = 0.15;
const tankWidth = 80;
const birdStartX = -200;
p.setup = function() {
  p.createCanvas(width, height); //creates the canvas
  inLoading = true;
  inGame = false;
  inEnd = false;
  round1 = true;
  round2 = false;
  choseTank = false;
  chosePower = false;
  //information about the available tanks
  tanks = [
    { speed: 5, strength: 1.0 },
    { speed: 1, strength: 2.0 },
    { speed: 3, strength: 1.5 },
    { speed: 10, strength: 0.5 }
  ];
  //colors for the players
  red = p.color(255, 0, 0);
  blue = p.color(0, 0, 255)
  white = p.color(170, 170, 170);
  green = p.color(0, 255, 0);
  //Array that includes all of the power ups
  powerups = [
    "Increased Speed",
    "Increased Strength",
    "Decreased Strength",
    "Added Lives",
    "Freeze other player"
  ];
  //heart image
  heart = p.loadImage("https://cdn.glitch.com/57f55b3b-b895-4e72-866d-f95fc2b51cb4%2Fexternal-content.duckduckgo-1.png?v=1595191432312");
  //Array that includes all of the images of birds
  birdImages = [
    p.loadImage("https://cdn.glitch.com/96bdcacf-81f0-433c-8e06-d5f4e058f409%2FBirdImage.png?v=1595812296873"),
    p.loadImage("https://cdn.glitch.com/96bdcacf-81f0-433c-8e06-d5f4e058f409%2FCyanBird.png?v=1595893154238"),
    p.loadImage("https://cdn.glitch.com/96bdcacf-81f0-433c-8e06-d5f4e058f409%2FPinkBird.png?v=1595893172421"),
    p.loadImage("https://cdn.glitch.com/96bdcacf-81f0-433c-8e06-d5f4e058f409%2FWhiteBird.png?v=1595893187271"),
    p.loadImage("https://cdn.glitch.com/96bdcacf-81f0-433c-8e06-d5f4e058f409%2FShinyBird.png?v=1595893141564")
  ];
  birds = [];//array that carries all the birds
  for (let i = 0; i < birdImages.length; i++) {
    birds[i] = new Bird(birdImages[i], powerups[i]); //creates the birds
  }
  //creates the tanks
  tank1 = new Tank(width / 10, height - 20, width / 10, 15, red, true);
  tank2 = new Tank((width / 10) * 8, height - 20, width / 10, 15, blue, false);
  //tank 1 angle
  v1 = p.createVector(tank1.x, 0);
  v2 = p.createVector(p.mouseX - tank1.x, p.mouseY - tank1.y);
  //tank 2 angle
  v4 = p.createVector(tank2.x, 0);
  v5 = p.createVector(p.mouseX - (tank2.x + tank2.width),p.mouseY - tank2.y);
};

p.draw = function() {
  p.background(240); //sets the background at a very light gray
  if (inLoading) {
    //loading screen
    drawTower(); //makes the tower and windows
    //all intro statements
    p.fill(0);
    p.textSize(40);
    p.text("Welcome to", 300, 90);
    p.textSize(55);
    p.text("TANK BATTLES", 200, 160);
    p.textSize(20);
    p.text("Press your spacebar to begin multiplayer mode", 190, 190);
  } else if (inChoice) {
    p.fill(0);
    //creates the tank choices
    p.rect(50, 180, 80, 15);
    p.rect(250, 165, 80, 30);
    p.rect(450, 165, 60, 30);
    p.rect(650, 180, 20, 15);
    //written info about tanks
    p.textSize(15);
    for (let i = 0; i < tanks.length; i++) {
      p.text("Speed: " +tanks[i].speed +"\n" +"Strength: " +100 * tanks[i].strength +"%",50 + 200 * i,210);
    }
    
    //creates color/power choice squares
    p.fill(blue);
    p.rect(50, 350, 100, 100);
    p.fill(green);
    p.rect(250, 350, 100, 100);
    p.fill(red);
    p.rect(450, 350, 100, 100);
    p.fill(white);
    p.rect(650, 350, 100, 100);
    //writes what the power up is
    p.textSize(15);
    p.fill(0);
    for (let i = 0; i < tanks.length; i++) {
      p.text("Powerup:\n" + powerups[i], 50 + 200 * i, 465);
    }
    
    //if its the first round of choice
    if (round1) {
      p.fill(0);
      p.textSize(30);
      p.text("Choose Tank: Player 2", 50, 50);
      p.text("Choose Powerup: Player 1", 50, 300);
      p.text("Press Spacebar to switch roles when you finish", 50, 540);
    } else if (round2) {//if its the second
      p.fill(0);
      p.textSize(30);
      p.text("Choose Tank: Player 1", 50, 50);
      p.text("Choose Powerup: Player 2", 50, 300);
      p.text("Press Spacebar to begin game when you finish", 50, 540);
    }
  } else if (inGame) {//if in the game
    //creates the scoreboard outline
    p.stroke(0);
    p.strokeWeight(5);
    p.fill(255);
    for (let i = 0; i <= 5; i++) {
      p.rect(100 + 200 * (i % 3), 20 + 40 * ((i - (i % 3)) / 3), 200, 40); //Makes the scoreboard box
    }
    //Fill in scoreboard
    p.noStroke();
    p.textSize(20);
    p.fill(tank1.color);
    p.text("Player 1", 170, 45);
    p.fill(tank2.color);
    p.text("Player 2", 570, 45);
    tank1.drawLives(100);
    tank2.drawLives(510);
    //draws the shooting lines for the tanks
    if (tank1.shooter) {
      p.fill(tank1.color);
      if (p.mouseIsPressed) {
        p.stroke(0);
        p.line(tank1.x, tank1.y, p.mouseX, p.mouseY); // draws the shooting line guide thing
        p.noStroke();
      }
    }else if(tank2.shooter){
      p.fill(tank2.color);
      if (p.mouseIsPressed) {
        p.stroke(0);
        p.line(tank2.x + tank2.width, tank2.y, p.mouseX, p.mouseY); // draws the shooting line guide thing
        p.noStroke();
      }
    }
    p.text("Shooter", 370, 45);//tells who is the shooter
    drawTower(); //Makes the tower
    for (let i = 0; i < birds.length; i++) {
      //draws and moves the birds
      birds[i].moveBird();
      birds[i].drawBird();
      if (isReleased) {
        birds[i].collideMissile();
      }
    }
    //creates the tanks
    tank1.show();
    v2 = p.createVector(p.mouseX - tank1.x, p.mouseY - tank1.y);
    tank2.show();
    v5 = p.createVector(p.mouseX - (tank2.x + tank2.width),p.mouseY - tank2.y);
    checkKey();//checks movement of the tanks
    p.stroke(0);
    p.strokeWeight(2);
    if (isReleased) {//if missile is released
      if (tank1.isShooter()) {
        missile.isOffBoundary();//checks if if it hit sides
        missile.drawMissile();//moves missile
        tank2.isHit();//checks if it his tank
      } else {
        missile.isOffBoundary();
        missile.drawMissile();
        tank1.isHit();
      }
    }
    p.noStroke();
  } else if (inEnd) {
    p.textSize(55);
    if(tank1.winner){//if tank 1 won
      p.text("Player 1 wins!", 250, 160);//says who won
      p.fill(tank1.color)//draws the winning tank
      p.rect(350, 250, tank1.width, tank1.height);
    }else{
      p.text("Player 2 wins!", 250, 160);
      p.fill(tank2.color)
      p.rect(350, 250, tank2.width, tank2.height);
    }
    //asks to play again
    p.fill(0);
    p.textSize(20);
    p.text("Press your spacebar to play again", 240, 400);
  }
}

p.mouseClicked = function() {
  if (round1 && inChoice) {//a bunch of if statements that check if the player picked a tank/powerup
    if (p.mouseY >= 350 && p.mouseY <= 450) {
      if (p.mouseX >= 50 && p.mouseX <= 150) {
        chosePower = true;
        tank1.color = blue;
        tank1.speed += 1;
      } else if (p.mouseX >= 250 && p.mouseX <= 350) {
        chosePower = true;
        tank1.color = green;
        tank1.time += 0.05;
      } else if (p.mouseX >= 450 && p.mouseX <= 550) {
        chosePower = true;
        tank1.color = red;
        tank1.time -= 0.05;
      } else if (p.mouseX > 650 && p.mouseX <= 750) {
        chosePower = true;
        tank1.color = white;
        tank1.lives += 1;
      }
    } else if (
      p.mouseX >= 50 &&
      p.mouseX <= 130 &&
      p.mouseY >= 180 &&
      p.mouseY <= 195
    ) {
      choseTank = true;
      tank2.speed += 0;
      tank2.width = 80;
      tank2.height = 15;
      tank2.time += time * (tanks[0].strength - 1);
    } else if (
      p.mouseX >= 250 &&
      p.mouseX <= 330 &&
      p.mouseY >= 165 &&
      p.mouseY <= 195
    ) {
      choseTank = true;
      tank2.speed -= 4;
      tank2.time += time * (tanks[1].strength - 1);
      tank2.width = 80;
      tank2.height = 30;
    } else if (
      p.mouseX >= 450 &&
      p.mouseX <= 510 &&
      p.mouseY >= 165 &&
      p.mouseY <= 195
    ) {
      choseTank = true;
      tank2.speed -= 2;
      tank2.width = 60;
      tank2.height = 30;
      tank2.time += time * (tanks[2].strength - 1);
    } else if (
      p.mouseX > 650 &&
      p.mouseX <= 670 &&
      p.mouseY >= 180 &&
      p.mouseY <= 195
    ) {
      choseTank = true;
      tank2.speed += 5;
      tank2.width = 10;
      tank2.height = 15;
      tank2.time += time * (tanks[3].strength - 1);
    }
  } else if (round2 && inChoice) {
    if (p.mouseY >= 350 && p.mouseY <= 450) {
      if (p.mouseX >= 50 && p.mouseX <= 150) {
        chosePower = true;
        tank2.color = blue;
        tank2.speed += 1;
      } else if (p.mouseX >= 250 && p.mouseX <= 350) {
        chosePower = true;
        tank2.color = green;
        tank2.time += 0.05;
      } else if (p.mouseX >= 450 && p.mouseX <= 550) {
        chosePower = true;
        tank2.color = red;
        tank2.time -= 0.05;
      } else if (p.mouseX > 650 && p.mouseX <= 750) {
        chosePower = true;
        tank2.color = white;
        tank2.lives += 1;
      }
    } else if (p.mouseX >= 50 &&p.mouseX <= 130 &&p.mouseY >= 180 &&p.mouseY <= 195) {
      choseTank = true;
      tank1.speed += 0;
      tank1.width = 80;
      tank1.height = 15;
      tank1.time += time * (tanks[0].strength - 1);
    } else if (p.mouseX >= 250 && p.mouseX <= 330 && p.mouseY >= 165 && p.mouseY <= 195) {
      choseTank = true;
      tank1.speed -= 4;
      tank1.time += time * (tanks[1].strength - 1);
      tank1.width = 80;
      tank1.height = 30;
    } else if (p.mouseX >= 450 && p.mouseX <= 510 && p.mouseY >= 165 && p.mouseY <= 195) {
      choseTank = true;
      tank1.speed -= 2;
      tank1.width = 60;
      tank1.height = 30;
      tank1.time += time * (tanks[2].strength - 1);
    } else if (p.mouseX > 650 && p.mouseX <= 670 && p.mouseY >= 180 && p.mouseY <= 195) {
      choseTank = true;
      tank1.speed += 5;
      tank1.width = 10;
      tank1.height = 15;
      tank1.time += time * (tanks[1].strength - 1);
    }
  }
};

p.mouseReleased = function() {
  if (inGame) {
    console.log("player1: " + tank1.isShooter());
    let angle = 0;
    let velocity = 0;
    if (tank1.isShooter()) {
      missile = new Missile(tank1.x, height - 20);
      angle = getAngle(v1, v2);
      velocity = getDistance(tank1.x, tank1.y); //can adjust if too much or too little

      console.log("Missile Starting Point: " + missile.x + ", " + missile.y);
      if (p.mouseY <= tank1.y) {
        missile.shoot(angle, velocity);

        console.log("angle: " + angle);
        console.log("distance: " + velocity);

        isReleased = true;
      }
    }
    if (tank2.isShooter()) {
      missile = new Missile(tank2.x + tank2.width, height - 20);

      angle = getAngle(v4, v5);
      velocity = getDistance(tank2.x + tankWidth, tank2.y); //can adjust if too much or too little

      console.log("Missile Starting Point: " + missile.x + ", " + missile.y);
      if (p.mouseY <= tank2.y) {
        missile.shoot(angle, velocity);
        console.log("angle: " + angle);
        console.log("distance: " + velocity);
        isReleased = true;
      }
    }
  }
};

function getAngle(v1, v2) {
  let angleBetween = p.degrees(v1.angleBetween(v2));
  return angleBetween;
}

function getDistance(x, y) {
  //initial velocity (can adjust later)
  let deltaX = p.mouseX - x;
  let deltaY = p.mouseY - y;
  let distance = p.sqrt(deltaX ** 2 + deltaY ** 2);
  return distance;
}

p.keyPressed = function() {//if statements used to switch in between screens
  if (p.keyCode == 32 && inLoading) {
    inLoading = false;
    inChoice = true;
  } else if (p.keyCode == 32 && inChoice && round1 && choseTank && chosePower) {
    choseTank = false;
    chosePower = false;
    round1 = false;
    round2 = true;
  } else if (p.keyCode == 32 && inChoice && round2 && choseTank && chosePower) {
    inChoice = false;
    inGame = true;
    choseTank = false;
    chosePower = false;
    round1 = true;
    round2 = false;
    console.log(tank1.time);
    console.log(tank2.time);
    birds[p.round(p.random(birds.length - 1))].move = true; //randomly picks a bird to move
  } else if (p.keyCode == 32 && inEnd) {
    inEnd = false;
    inChoice = true;
    tank1.lives = 5;
    tank2.lives = 5;
  }
};

function checkKey() {//used to consistently check if the player wants to move
  if (tank1.isShooter()) {
    if (p.keyIsDown(p.LEFT_ARROW)) {
      tank2.moveLeft(500);
    } else if (p.keyIsDown(p.RIGHT_ARROW)) {
      tank2.moveRight(width - tank2.width);
    }
  }
  if (tank2.isShooter()) {
    if (p.keyIsDown(p.LEFT_ARROW)) {
      tank1.moveLeft(0);
    }
    if (p.keyIsDown(p.RIGHT_ARROW)) {
      tank1.moveRight(width / 2 - tank1.width * 2);
    }
  }
}

function drawTower() {//draws the tower
  p.fill(103);
  p.noStroke();
  p.rect(300, 350, 200, 250); //draws tower
  for (let i = 0; i <= 3; i++) {
    //draws windows
    p.fill(169, 204, 203);
    p.rect(325 + 100 * (i % 2), 400 + 100 * ((i - (i % 2)) / 2), 50, 25);
  }
}

function switchTurn() {//switchs the players turns
  tank1.switch();
  tank2.switch();
  isReleased = false;
}

class Bird {
  //create the bird object
  constructor(img, power) {
    this.x = birdStartX;
    this.y = p.random(100, 330);
    this.size = 20;
    this.move = false;
    this.image = img;
    this.powerup = power;
  }

  moveBird() {//moves the bird and checks that its still on the screen
    if (this.move == true && this.x > width) {
      //if it goes off the screen
      this.move = false;
      this.x = birdStartX; //puts the bird back to its x initial position
      this.y = p.random(100, 230); //changes its y position
      birds[p.round(p.random(birds.length - 1))].move = true; //chooses a new bird to move
    } else if (this.move) {
      this.x += 1; //moves the bird one unit
    }
  }

  drawBird() {//draws the bird
    p.image(this.image, this.x, this.y, this.size, this.size); //draws the bird
  }

  collideMissile() {//checks if it collided with a missile
    let hit = p.collideRectCircle(this.x, this.y, this.size, this.size, missile.x, missile.y, missile.diameter);
    if (hit) {
      if ((this.powerup == powerups[0])) {
        if (tank1.shooter) {
          tank1.speed += 1;
        } else if (tank2.shooter) {
          tank2.speed += 1;
        }
      } else if ((this.powerup == powerups[1])) {
        if (tank1.shooter) {
          tank1.time += 0.05;
        } else if (tank2.shooter) {
          tank2.time += 0.05;
        }
      } else if ((this.powerup == powerups[2])) {
        if (tank1.shooter) {
          if (tank1.time >= 0.02) {
            tank1.time -= 0.02;
          }
        } else if (tank2.shooter) {
          if (tank2.time >= 0.02) {
            tank2.time -= 0.02;
          }
        }
      } else if ((this.powerup == powerups[3])) {
        if (tank1.shooter) {
          tank1.lives++;
          console.log(tank1.lives);
        } else if (tank2.shooter) {
          tank2.lives++;
          console.log(tank2.lives);
        }
      } else if ((this.powerup == powerups[4])) {
        if (tank1.shooter) {
          tank2.speed = 0;
        } else if (tank2.shooter) {
          tank1.speed = 0;
        }
      }
      this.move = false;
      this.x = birdStartX; //puts the bird back to its x initial position
      this.y = p.random(100, 230); //changes its y position
      birds[p.round(p.random(birds.length - 1))].move = true; //chooses a new bird to move
    }
  }
}

class Tank {
  constructor(x, y, w, h, color, shooter) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = color;
    this.shooter = shooter;
    this.lives = 5;
    this.speed = 5;
    this.time = time;
    this.winner = false
  }

  isShooter() {
    return this.shooter;
  }

  show() {//draws the tanks
    p.rectMode(p.CORNER);
    p.fill(this.color);
    p.rect(this.x, this.y, this.width, this.height);
  }

  isHit() {//checks if it hit the missile
    let hit = p.collideRectCircle(this.x, this.y, this.width, this.height, missile.x, missile.y, missile.diameter);//boolean that checks if the missile collided with the tank
    if (hit && this.lives > 1) {//if it has multiple lives left it just decreases the lives by one and switches turns
      this.lives--;
      console.log("You hit something!");
      switchTurn();
    } else if (hit && this.lives == 1) {//if the player only has one life left they die and lose
      if(this == tank1){
        tank2.winner = true
      }else if(this == tank2){
        tank1.winner = true
      }else{
        console.log('Hmmm change this');
      }
      this.lives--;
      inGame = false;
      inEnd = true;
      for (let i = 0; i < birds.length; i++) {
        //stops all the birds from moving
        if (birds[i].move) {
          birds[i].move = false;
          birds[i].x = birdStartX;
        }
      }
      switchTurn();
    }
    
  }

  moveLeft(leftBound) {//moves tank left unless past the bound
    if (this.x >= leftBound) {
      this.x -= 2;
    } else {
      this.x = this.x + this.speed;
    }
  }

  moveRight(rightBound) {//moves tank right unless past the bound
    if (this.x <= rightBound) {
      this.x += 2;
    } else {
      this.x = this.x - this.speed;
    }
  }

  switch() {//switchs the players roles
    if (this.shooter) {
      this.shooter = false;
    } else {
      this.shooter = true;
    }
  }

  drawLives(xPos) {//draws the lives in the scoreboard
    for (var i = 0; i < this.lives; i++) {
      p.image(heart, xPos + i * 30, 65, 35, 35); //draws hearts
    }
  }
}

class Missile {
  //makes the missile object
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.diameter = 20;
  }

  // takes in the angle, velocity, and time (time is a global variable)
  shoot(angle, initVel) {
    let degree = angle;
    let radians = (angle * p.PI) / 180;
    console.log("Magnitude" + initVel);
    this.xVelocity = initVel * Math.cos(radians);
    this.yVelocity = initVel * Math.sin(radians);

    console.log("velocity x: " + this.xVelocity + ", velocity y: " + this.yVelocity);
  }

  // changes x and y position
  move() {
    if (tank1.shooter) {
      this.x += this.xVelocity * tank1.time;
      this.y -= this.yVelocity * tank1.time;
      

      this.yVelocity -= 9.8 * tank1.time;
    } else if (tank2.shooter) {
      console.log(this.x + " + " + this.xVelocity + " + " + tank2.time);
      this.x += this.xVelocity * tank2.time; //*time?
      this.y -= this.yVelocity * tank2.time;
      //console.log("move: " + this.x + ", " + this.y);

      this.yVelocity -= 9.8 * tank2.time;
    }
  }

  // draws the missile's path
  drawMissile() {
    this.move();
    p.fill("black");
    //console.log("draw: " + this.x + ", " + this.y);
    p.ellipse(this.x, this.y, this.diameter);
  }

  isOffBoundary() {//checks if its past the boundary
    if(this.x < 0 || this.x > width || this.y > height){
      switchTurn();
    }else if(p.collideRectCircle(300,350,200,250,missile.x,missile.y,missile.diameter)){
      switchTurn();
    }
  }
}
