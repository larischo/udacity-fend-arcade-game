//pause?
let isPaused = true;
//modals
let winModal= document.querySelector(".win");
let startModal= document.querySelector(".start");
//position of player
let posX;
let posY;

//Enemies
var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    //image/sprite for our enemies
    this.sprite = 'images/enemy-bug.png';
};

//Update the enemy's position
//Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if(!isPaused) {
        this.x += 25 * this.speed * dt;
    }

    // collison detection
    if (parseInt(this.x)+ 50 >= posX && parseInt(this.x) <= posX + 50 && parseInt(this.y)+ 50 >= posY && parseInt(this.y) <= posY +50){
        //console.log("collision x,y: "+this.x+","+this.y+" player x,y:"+posX+","+posY);  
        player.reset();
    }
};

//Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//delete Enemies out of Screen
function deleteEnemies() {
    for( var i = 0; i < allEnemies.length-1; i++){ 
        if ( allEnemies[i].x > 500) {
            allEnemies.splice(i, 1); 
        }
    }
}

//player class
var Player = function(x,y,sprite) {
    this.x=x;
    this.y=y;
    this.sprite=sprite;
};

//update player position
Player.prototype.update = function(){
    posX = this.x;
    posY = this.y;
    //if player in water area = winning
    if(posY<=0){
        player.reset();
        isPaused = true;
        //show modal
        winModal.setAttribute("style","display: block");
    }
}

//draw player on canvas
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//move player around map
Player.prototype.handleInput = function(pressedKey){
    if (pressedKey === 'left' && this.x > 0){
        this.x -= 25;
    }
    if (pressedKey === 'right' && this.x < 400){
        this.x += 25;
    }
    if (pressedKey === 'up' && this.y >= 0){
        this.y -= 25;
    }
    if (pressedKey === 'down' && this.y < 450){
        this.y += 25;
    }
}

//reset position of player
Player.prototype.reset = function(){
    this.x=200;
    this.y=450;
}

// this is to randomly pick locations for bugs
//https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
setInterval(function instances(){
    if(!isPaused) {
        let enemyY = Math.floor(Math.random()*(230-50+1)+50);
        let enemySpeed = Math.floor(Math.random()*(25-0+1)+1);
        allEnemies.push(new Enemy(0, enemyY, enemySpeed));
        deleteEnemies();
    }
},1000)

//instantiate all enemy objects
var allEnemies = [ new Enemy(0, 50, 2), new Enemy(0, 230, 5)];

//instantiate the player
var player = new Player( 200, 450, 'images/char-princess-girl.png');

//start game
function start(mySprite){ 
    //hide modals
    startModal.setAttribute("style","display: none");
    //unpause
    isPaused = false;
    //change player icon according to user input
    player.sprite=mySprite;
}
//if winning reset start modal
function win(){;
    startModal.setAttribute("style","display: block");
    winModal.setAttribute("style","display: none");
    //reset enemies to start
    allEnemies = [ new Enemy(0, 50, 2), new Enemy(0, 230, 5)];
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
   player.handleInput(allowedKeys[e.keyCode]);
});
