Carrot = function(game, x, y) {
    //Phaser.Sprite.call(this, game, x, y, 'rocket');
    Phaser.Graphics.call(this, game, x, y);
    this.graphics = game.add.graphics(0, 0);
    window.graphics = this.graphics;
    
    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);
    
    // Define constants that affect collision
    this.EAT_DISTANCE = 4; //pixels
    this.CALORIE_COUNT = 24;

    var colors = ["0xE59400"];
    var rand = Math.floor(Math.random() * colors.length);
    this.color = colors[rand];
};

// Rabbits are a type of Phaser.Graphics

// Carrots are a type of Phaser.Graphics
Carrot.prototype = Object.create(Phaser.Graphics.prototype);//Object.create(Phaser.Sprite.prototype);
Carrot.prototype.constructor = Carrot;

Carrot.prototype.update = function() {
    // draw a rectangle
    this.graphics.clear();
    if(this.alive) {
        graphics.lineStyle(1, this.color, 1);
        graphics.drawRect(this.x, this.y, 1, 1);
    }
};