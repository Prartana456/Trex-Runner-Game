var trex, trexImage, trexCollided;
var ground, invisibleGround, groundImage;
var cloudImage, cloudGroup;
var obstacleImg1, obstacleImg2, obstacleImg3, obstacleImg4, obstacleImg5, obstacleImg6, obstacleGroup;
var over, overImage, restart, restImage;
var count;
var PLAY = 1, END = 0;
var gameState = PLAY;

localStorage["HighestScore"] = 0;

function preload() {
  
  trexImage = loadAnimation("trex1.png","trex4.png", "trex3.png");
  trexCollided = loadAnimation("trex_collided.png"); 
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacleImg1 = loadImage("obstacle1.png");
  obstacleImg2 = loadImage("obstacle2.png");
  obstacleImg3 = loadImage("obstacle3.png");
  obstacleImg4 = loadImage("obstacle4.png");
  obstacleImg5 = loadImage("obstacle5.png");
  obstacleImg6 = loadImage("obstacle6.png");
  overImage = loadImage("gameOver.png");
  restImage = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  count = 0;
  
  //the trex being formed
  trex = createSprite(200,180,20,50);
  trex.addAnimation("trexImg", trexImage);
  trex.addAnimation("trexImge", trexCollided);
  trex.scale = 0.5;
  trex.x = 50;
  
  //the ground being formed
  ground = createSprite(200,180,400,20);
  ground.addImage(groundImage);
  ground.x = ground.width /2;
  
  //create the invisible ground
  invisibleGround = createSprite(200,185,400,5);
  invisibleGround.visible = false;
  
  //to create the gameover and restart 
  over = createSprite(300,100);
  over.addImage(overImage);
  over.scale = 0.5;  
  over.visible = false;
  restart = createSprite(300,150); 
  restart.addImage(restImage);
  restart.scale = 0.5;
  restart.visible = false;
  
  cloudGroup = new Group() ;
  
  obstacleGroup = new Group() ;
 
}

function draw() {
  background("white");
  
  //to call the play gamestate
  if (gameState === PLAY){
  
  //to jump when keyDown is pressed
  if (keyDown("space") && trex.y >= 158) {
  trex.velocityY = -12;    
  }
    
  //to make the ground moving
    
  ground.velocityX = -(6 + 3*count/100);
  if (ground.x < 0){
      ground.x = ground.width/2;
  }
    
  count = count + Math.round(getFrameRate()/60);
         
  //to add gravity 
  trex.velocityY = trex.velocityY + 0.8;
  
  //to call the function spawn clouds & obstacles
  spawnClouds();  
  spawnObstacles();
    
  //to stop the game 
  if (trex.isTouching (obstacleGroup)) {
      gameState = END;
      } 
  
  }
  else if (gameState === END){
  //to make the ground freeze
    ground.velocityX = 0;
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    trex.changeAnimation("trexImge",trexCollided);
    over.visible = true;
    restart.visible = true;
    trex.velocityY = 0;
 }
   
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //to make trex walk over the ground
  trex.collide(invisibleGround);
  
  //for the scoring system
  text("Score: "+ count,450, 100);
      
  drawSprites();
    
}

function reset () {
  gameState = PLAY;
  over.visible = false;
  restart.visible = false;
  trex.changeAnimation("trexImg", trexImage);
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  count = 0;
  if(localStorage["HighestScore"]<count){ localStorage["HighestScore"] = count; } console.log(localStorage["HighestScore"]);
}

function spawnClouds () {
//write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 180;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudGroup.add(cloud);
  }
}

function spawnObstacles () { 
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,60,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    // console.log(rand);
    
    switch (rand) {
      case 1: obstacle.addImage(obstacleImg1); break;
      case 2: obstacle.addImage(obstacleImg2);break;
      case 3: obstacle.addImage(obstacleImg3); break;
      case 4: obstacle.addImage(obstacleImg4); break;
      case 5: obstacle.addImage(obstacleImg5); break;
      case 6: obstacle.addImage(obstacleImg6); break;
      default: break;
      }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 170;
                      
    //add each obstacle to the group
    obstacleGroup.add(obstacle);
  }
}  