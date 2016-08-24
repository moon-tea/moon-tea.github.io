var CarrotMaker = {
    Carrot: function(game, id, x, y) {
        //var gobj = Object.create( new GraphicsObject(game, x, y));
        var colors = ["0xE59400"];
        var rand = Math.floor(Math.random() * colors.length);
        var c = Object.assign(
            //{},

            new GraphicsObject(game, x, y),
            //new GraphicsObject(game, x, y)
            //Object.assign({}, SmartObject),
            SmartObjectMaker.SmartObject(),
            //this.state(id)
            {
            EAT_DISTANCE: 4, //pixels
            calorie_count: 24,
            id: id,
            color: colors[rand]
                
            }
            //this.canBuild(id)
        );
        //c.__proto__ = new GraphicsObject(game, x, y);//Object.create(Phaser.Graphics.prototype);
        c.addAdvertisedAction(new EatCarrotAction(id, x, y));
        return c;
    },
    canBuild: function(id) { 
        return {
            id: id,
            tools: ['hammer', 'pliers'],
            use: function(tool) { this.tools.push(tool); },
            build: function(thing) { 
                var withTool = parseInt(Math.floor(Math.random() * this.tools.length));
            }
        }
    }
};

/*
Carrot = function(game, id, x, y) {
    GraphicsObject.call(this, game, x, y);
    //SmartObject.call(this, "Carrot"+id);
    //Phaser.Sprite.call(this, game, x, y, 'rocket');
    //Phaser.Graphics.call(this, game, x, y);
    //this.graphics = game.add.graphics(0, 0);
    //window.graphics = this.graphics;
    
    // Set the pivot point for this sprite to the center
    //this.anchor.setTo(0.5, 0.5);
    
    //this.smartObject = new SmartObject(this, "Carrot"+id);

    // Define constants that affect collision
    this.EAT_DISTANCE = 4; //pixels
    this.calorie_count = 24;

    this.id = id;
    var colors = ["0xE59400"];
    var rand = Math.floor(Math.random() * colors.length);
    this.color = colors[rand];
    this.smartObject.addAdvertisedAction(new EatCarrotAction(this.id, x, y));
};
//Carrot.prototype = Object.create();//SmartObject.prototype);//Object.create(Phaser.Sprite.prototype);

Carrot.prototype.constructor = Carrot;

Carrot.prototype.update = function() {
    GraphicsObject.prototype.update(this);
    this.smartObject.update(this.smartObject);
};
*/