//The base class, this is our link into the phaser typical inheritance chain.
GraphicsObject = function(game, x, y) {
    //call to parent function
    Phaser.Graphics.call(this, game, x, y);
    
    this.visible = true;
    this.x = x;
    this.y = y;
    this.color = "0x000000"; //default color in hex "black"
    
    //add graphcis to the object
    this.graphics = game.add.graphics(0, 0);
    //register these graphics to the window
    window.graphics = this.graphics;
    
    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);
    
};

//typical prototype / constructor model for inheritance structures
GraphicsObject.prototype = Object.create(Phaser.Graphics.prototype);
GraphicsObject.prototype.constructor = GraphicsObject;

//TODO: this might actually do better as a render step.
//might not be necessary if we are going to do sprites eventually anyway
GraphicsObject.prototype.update = function() {
    this.graphics.clear();
    //draw pixel representation
    if(this.alive) {
        this.graphics.lineStyle(1, this.color, 1);
        this.graphics.drawRect(this.x, this.y, 1, 1);
    }
};