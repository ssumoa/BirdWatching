/**
 * @name Mic Threshold
 * @arialabel Black rectangle is drawn on the bottom of a bar based on the amplitude of the user’s audio input. At a certain minimum amplitude, grey squares are randomly drawn on the right side of the screen
 * @description <p>Trigger an event (draw a rectangle) when the Audio Input
 * volume surpasses a threshold.</p>
 * <p><em><span class="small"> To run this example locally, you will need the
 * <a href="http://p5js.org/reference/#/libraries/p5.sound">p5.sound library</a>
 * and a running <a href="https://github.com/processing/p5.js/wiki/Local-server">local server</a>.</span></em></p>
 */
// Adapted from Learning Processing, Daniel Shiffman
// learningprocessing.com
let input;
let n = 50;
let circles = [];
let birds = [];
let bg1;
let bg2;
let bg3;
let bg4;

let bgm;
let myFont;

let imgW = [];
let imgB = [];
let imgX = 30;
let imgY = 30;
let frameNum = 0;
let xPos = 30;

let life = true;
let event = false; // when event is true, birds start flying out of window
let time = 0;
let endTime = 0;

let curState = 0;

function preload() {
  for (let i = 1; i <= 12; i++) {
    imgW[i - 1] = loadImage("data/img/w/" + i + ".png");
  }
  for (let i = 1; i <= 12; i++) {
    imgB[i - 1] = loadImage("data/img/b/" + i + ".png");
  }

  bg1 = loadImage("data/img/bg1.png");
  bg2 = loadImage("data/img/bg2.png");
  bg3 = loadImage("data/img/bg3.png");
  bg4 = loadImage("data/img/bg4.png");
  bgm = loadSound('data/The_Lucky_One-Au_Revoir_Simone.mp3');

  myFont = loadFont('data/Redrains.otf');

}

function setup() {
  let main = createCanvas(1920, 1080);
  main.parent("item");
  
  background(0);
  noStroke();
  frameRate(24);

  for (let i = 0; i < n; i++) {
    let x = random(width / 4);
    let y = random(height);
    birds[i] = new Bird(x, y);
  }
  input = new p5.AudioIn();
  input.start();
}

let bgl =0;
let bgl_f = true;

function draw() {
  if(curState ==1) state1();


  if(bgl <=90 && bgl_f){
    fill(0, 5, 20,bgl);
    bgl +=0.5;
    rect(0,0,width,height);
    if(bgl == 90) bgl_f = !bgl_f;
  }else{
    fill(0, 5, 20,bgl);
    bgl -=0.5;
    rect(0,0,width,height);
    if(bgl == 0) bgl_f = !bgl_f;
  }

  if(curState ==0) state0();
}

function state0() {
  bgm.stop();
  background(bg1);
  fill(0,200);
  rect(0,0,width,height);
  fill(255);
  textFont(myFont);
  textAlign(CENTER);
  textSize(100);
  text("Bird Watching", width/2, 240 + 50);
  textSize(40);
  text("NOTICE", width/2, 720);
  textAlign(LEFT);
  textSize(32);
  text("Click anywhere to watch birds", width/2 - 240 + 30, 720+ 60);
  text("Press ENTER to FullScreen", width/2 - 240 + 30, 720+ 70 + 40);
  text("Press ESC to return to this page", width/2 - 240 + 30, 720+70 + 40*2);
  textSize(26);
  textAlign(CENTER);
  text("Birds are pretty sensitive to noise", width/2, 420 );
  text("You should be quite! Or They'll just go away", width/2,420+46) ;
  textSize(32);

  text("Enjoy your bird watching!", width/2,420+46*3);
  
}



function state1() {
  noCursor();
  if(!bgm.isPlaying()) bgm.play();
  if (frameCount % 24 == 0) time++;
  
  let volume = input.getLevel();

  let v = map(volume, 0, 0.2, 0, 100);
  if (v > 25) {
    endTime = frameCount + 4*24;
  }
  if (frameCount >= endTime) {
    event = false; //
  } else event = true;
  console.log(v);

  background(bg4,180);

  if (life) {
    makeNewBird(140, 20);
    if (birds.length == 140) life = !life;
  } else {
    removeBird(110, 10);
    if (birds.length == 110) life = !life;
  }
  if (!event) { //
    for (let i = 0; i < birds.length; i++) {
      birds[i].update(random(1, 1.5));
      birds[i].wrap();
      if ((30 <= i && i <= 60) || (100 <= i && i <= 120)) birds[i].display(1, imgW);
      else birds[i].display(1, imgB);
    }
  } else {
    
    for (let i = 0; i < birds.length; i++) {
      if (birds[i].posX < width / 2) {
        birds[i].update(-random(1.5, 4.5));
        birds[i].wrap();
        if ((30 <= i && i <= 60) || (100 <= i && i <= 120))
          birds[i].display(-1, imgW);
        else birds[i].display(-1, imgB);
      } else {
        birds[i].update(random(1.5, 4.5));
        birds[i].wrap();
        if ((30 <= i && i <= 60) || (100 <= i && i <= 120))
          birds[i].display(1, imgW);
        else birds[i].display(1, imgB);
      }
    }
  }
}

class Bird {
  constructor(posX_, posY_) {
    this.posX = posX_;
    this.posY = posY_;
    this.incr = 0;
    this.theta = 0;
  }

  update(dir) { //dir is direction of moving bird
    this.incr -= 0.008;
    this.theta = noise(this.posX * 0.06, this.posY * 0.04, this.incr) * TWO_PI;
    this.posX -= 5 * cos(this.theta) * dir;
    //if(this.posY>20 && posY <height-20) this.posY -= 4 * sin(this.theta);
    this.posY -= 4 * sin(this.theta) * dir;
    //console.log(this.posX + " : " + this.posY);
  }

  display(dir, imgArr) {
    if (
      this.posX > 0 &&
      this.posX < width &&
      this.posY > 0 &&
      this.posY < height
    ) {
      let size = this.posX;
      fill(0, 1.5);
      rect(0, 0, width, height);
      push();
      translate(this.posX, this.posY);
      rotate(radians(330));
      rotate(radians((35 * (this.posY * 2)) / float(height)));
      
      scale(1 + (size/width)*0.6);
      
      birdFly(0, 0, size, dir, imgArr);
      pop();
    }
  }

  wrap() {
    if (this.posX < 0) this.posX = width - 30;
    if (this.posX > width - 100) this.posX = 0;
    if (this.posY < 0) this.posY = height - 30;
    if (this.posY > height) this.posY = 0;
  }
}

function birdFly(posX, posY, size_, dir_, imgArr) {
  let size = 60 + 1.3 * ((size_ / width) * 100);
  let dir = 1 * dir_;
  scale(dir, 1);
  image(imgArr[frameNum], posX * dir, posY, size, size);
  frameNum++;
  if (frameNum >= 11) {
    frameNum = 0;
  }
}

function makeNewBird(n, rate) {
  if (birds.length < n) {
    if (random(100) < rate) {
      birds.push(
        new Bird(random(width / 8), random(height * 0.1, height * 0.9))
      );
    }
  }
}

function removeBird(n, rate) {
  if (birds.length > n) {
    if (random(100) < rate) {
      birds.pop(
        new Bird(random(width / 8), random(height * 0.1, height * 0.9))
      );
    }
  }
}

function mousePressed() {
  if (
    mouseX > 0 &&
    mouseX < windowWidth &&
    mouseY > 0 &&
    mouseY < windowHeight
  ) {
   curState = 1;

  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
  if (keyCode === ESCAPE) { //27 is ESC
    curState = 0;
  }
}
