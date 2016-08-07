Den = function(game, x, y) {
    //Phaser.Sprite.call(this, game, x, y, 'rocket');
    Phaser.Graphics.call(this, game, x, y);
    this.graphics = game.add.graphics(0, 0);
    window.graphics = this.graphics;
    
    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);
    
    // Define constants that affect collision
    this.SAFE_DISTANCE = 4; //pixels

    var colors = ["0x26190f"];
    var rand = Math.floor(Math.random() * colors.length);
    this.color = colors[rand];
};

// Carrots are a type of Phaser.Graphics
Den.prototype = Object.create(Phaser.Graphics.prototype);//Object.create(Phaser.Sprite.prototype);
Den.prototype.constructor = Den;

Den.prototype.update = function() {
    // draw a rectangle
    this.graphics.clear();
    if(this.alive) {
        graphics.lineStyle(1, this.color, 1);
        graphics.drawRect(this.x, this.y, 1, 1);
    }
};