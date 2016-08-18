Carrot = function(game, id, x, y) {
    SmartObject.call(this, "Carrot"+id);
    //Phaser.Sprite.call(this, game, x, y, 'rocket');
    Phaser.Graphics.call(this, game, x, y);
    this.graphics = game.add.graphics(0, 0);
    window.graphics = this.graphics;
    
    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);
    
    // Define constants that affect collision
    this.EAT_DISTANCE = 4; //pixels
    this.calorie_count = 24;

    var colors = ["0xE59400"];
    var rand = Math.floor(Math.random() * colors.length);
    this.color = colors[rand];
    this.id = id;
    this.addAdvertisedAction(new EatCarrotAction(this.id, x, y));
};

// Carrots are a type of SmartObject
Carrot.prototype = Object.create(SmartObject.prototype);//Object.create(Phaser.Sprite.prototype);
Carrot.prototype.constructor = Carrot;
