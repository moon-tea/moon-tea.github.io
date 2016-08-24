GraphicsObject = function(game, x, y) {
    this.color = "0x000000";
    Phaser.Graphics.call(this, game, x, y);
    this.graphics = game.add.graphics(0, 0);
    window.graphics = this.graphics;
    
    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);
    this.x = x;
    this.y = y;
};

GraphicsObject.prototype = Object.create(Phaser.Graphics.prototype);
GraphicsObject.prototype.constructor = GraphicsObject;

GraphicsObject.prototype.update = function() {
    //console.log(this);
    this.graphics.clear();
    //console.log(one.name);
    //draw pixel representation
    if(this.alive) {
        //console.log(one);
        this.graphics.lineStyle(1, this.color, 1);
        this.graphics.drawRect(this.x, this.y, 1, 1);
    }
};