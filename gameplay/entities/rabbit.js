// Rabbit constructor
var RabbitMaker = {
    Rabbit: function(game, x, y) {
        var colors = ["0x50190a","0x926239", "0x967327", "0x90594a", "0xa5684a", "0x5b3d24", "0xd3c0af", "0xc8b09c", ];
        var rand = 0;//Math.floor(ROT.RNG.getUniform() * colors.length);
        //var that = this;
        var rabbit = Object.assign(
            new GraphicsObject(game, x, y),
            SmartObjectMaker.SmartObject(),
            AgentMaker.Agent("phillip"),
            {
                // Define constants that affect motion
                //this.SPEED = 4.4; // 4.4 feet per second = 3mph
                //this.SPEED = 7*5; // 125mph
                SPEED: 1,
                TURN_RATE: 45,//15, // turn rate in degrees/frame
                WOBBLE_LIMIT: 5, // degrees
                WOBBLE_SPEED: 250, // milliseconds
                AVOID_DISTANCE: 1, // pixels

                color: colors[rand],
                feetTraveled: 0, //feet
                
                //start dietary needs
                weight: 6, //lbs
                poundsOfNonFat: 5, //lbs
                get poundsOfFat() { return this.weight - this.poundsOfNonFat }, //lbs
                calorieNeedsPerDay: 50, //cal
                calorieCountOfFoodInStomach: 0, //cal
                stomachCapacity: 400, //cal
                digestionRatePerDay: 400, //cal

                // Create a variable called wobble that tweens back and forth between
                // -WOBBLE_LIMIT and +WOBBLE_LIMIT forever
                wobble: 5,//this.WOBBLE_LIMIT, 
                
                //AI
                _current_plan: [],
                _target: null,
                plan: function() {
                    var planner = new Planner();

                    var plan = planner.plan(this, {
                        name: "calorieCount",
                        value: this.calorieNeedsPerDay
                    });
                    console.log(plan);
                    return plan;
                }
            }
        );
        //Object.assign(rabbit, AgentMaker.Agent("phil"));
        rabbit._game = game;
        rabbit._sprite = rabbit.graphics;
        rabbit.setState("calorieCount", 0);
        rabbit.game.physics.enable(rabbit, Phaser.Physics.ARCADE);

        rabbit.game.add.tween(rabbit).to(
            { wobble: -rabbit.WOBBLE_LIMIT }, rabbit.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.POSITIVE_INFINITY, true
        );

        rabbit.sm.add("idle", new IdleState(rabbit));
        rabbit.sm.add("moving", new MovingState(rabbit));
        rabbit.sm.add("action", new ActionState(rabbit));

        rabbit.sm.enter("idle");
        return rabbit;
    }
};

//Rabbit.prototype = Object.create(Phaser.Graphics.prototype);//Object.create(Phaser.Sprite.prototype);
//Rabbit.prototype = Object.create(GraphicsObject.prototype);
//Rabbit.prototype.constructor = Rabbit;
/*
Rabbit.prototype.plan = function() {
    var planner = new Planner();

    var plan = planner.plan(this.agent, {
        name: "calorieCount",
        value: this.calorieNeedsPerDay
    });
    //console.log(plan);
    return plan;
};

Rabbit.prototype.update = function() {
    GraphicsObject.prototype.update(this);
    this.agent.update();
};
*/