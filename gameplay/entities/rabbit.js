// Rabbit constructor
Rabbit = function(game, x, y) {
    Agent.call(this, "Rabbit");
    //Phaser.Sprite.call(this, game, x, y, 'rocket');
    console.log(this);
    Phaser.Graphics.call(this, game, x, y);
    this.graphics = game.add.graphics(0, 0);
    this._game = game;
    this._sprite = this.graphics;
    window.graphics = this.graphics;
                
    //game.context.fillRect(x, y, 4, 4);
    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);
    //this.tint = "0xFF0000";

    // Enable physics on the rabbit
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // Define constants that affect motion
    //this.SPEED = 4.4; // 4.4 feet per second = 3mph
    //this.SPEED = 7*5; // 125mph
    this.TURN_RATE = 45;//15; // turn rate in degrees/frame
    this.WOBBLE_LIMIT = 5; // degrees
    this.WOBBLE_SPEED = 250; // milliseconds
    this.AVOID_DISTANCE = 1; // pixels

    var colors = ["0x50190a","0x926239", "0x967327", "0x90594a", "0xa5684a", "0x5b3d24", "0xd3c0af", "0xc8b09c", ];
    var rand = 0;//Math.floor(ROT.RNG.getUniform() * colors.length);
    this.color = colors[rand];
    this.feetTraveled = 0; //feet
    //start dietary needs
    this.weight = 6; //lbs
    this.poundsOfNonFat = 5; //lbs
    this.poundsOfFat = this.weight - this.poundsOfNonFat; //lbs
    this.calorieNeedsPerDay = 50; //cal
    this.calorieCountOfFoodInStomach = 0; //cal
    this.stomachCapacity = 400; //cal
    this.digestionRatePerDay = 400; //cal

    // Create a variable called wobble that tweens back and forth between
    // -this.WOBBLE_LIMIT and +this.WOBBLE_LIMIT forever
    this.wobble = this.WOBBLE_LIMIT;
    this.game.add.tween(this).to(
        { wobble: -this.WOBBLE_LIMIT }, this.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.POSITIVE_INFINITY, true
    );

    //AI
    this._current_plan = [];
    this._target = null;
    this.setState("calorieCount", 0);
    this.addAction(new EatCarrotAction());
    this.addAction(new EatCarrotAction(1));
    this.addAction(new EatCarrotAction(2));
    this.addAction(new EatCarrotAction(3));
};

//Rabbit.prototype = Object.create(Phaser.Graphics.prototype);//Object.create(Phaser.Sprite.prototype);
Rabbit.prototype = Object.create(Agent.prototype);
Rabbit.prototype.constructor = Rabbit;

Rabbit.prototype.plan = function() {
    var planner = new Planner();

    var plan = planner.plan(this, {
        name: "calorieCount",
        value: this.calorieNeedsPerDay
    });
    console.log(plan);
    return plan;
};

Rabbit.prototype.update = function() {
    //Agent.prototype.update();
    //console.log(this);
    //console.log(Agent.prototype.update);
    Agent.prototype.update.call(this);

    // Calculate the angle from the rabbit to the nearest carrot 
    //substitute with whatever
    // target coordinates you need.
    /*
    var targetAngle = this.game.math.angleBetween(
        this.x, this.y,
        this.targetX, this.targetY
    );

    // Add our "wobble" factor to the targetAngle to make the rabbit wobble
    // Remember that this.wobble is tweening (above)
    targetAngle += this.game.math.degToRad(this.wobble);

    // Make each rabbit steer away from other rabbits.
    // Each rabbit knows the group that it belongs to (rabbitGroup).
    // It can calculate its distance from all other rabbits in the group and
    // steer away from any that are too close. This avoidance behavior prevents
    // all of the rabbits from bunching up too tightly and following the
    // same track.
    var avoidAngle = 0;
    this.parent.forEachAlive(function(m) {
        // Don't calculate anything if the other rabbit is me
        if (this == m) return;

        // Already found an avoidAngle so skip the rest
        if (avoidAngle !== 0) return;

        // Calculate the distance between me and the other rabbit
        var distance = this.game.math.distance(this.x, this.y, m.x, m.y);

        // If the rabbit is too close...
        if (distance < this.AVOID_DISTANCE) {
            // Chose an avoidance angle of 90 or -90 (in radians)
            avoidAngle = Math.PI/2; // zig
            //if (this.game.math.chanceRoll(50)) avoidAngle *= -1; // zag
            if (Phaser.Utils.chanceRoll(50)) avoidAngle *= -1; // zag
        }
    }, this);

    // Add the avoidance angle to steer clear of other rabbits
    targetAngle += avoidAngle;

    // Gradually (this.TURN_RATE) aim the rabbit towards the target angle
    if (this.rotation !== targetAngle) {
        // Calculate difference between the current angle and targetAngle
        var delta = targetAngle - this.rotation;

        // Keep it in range from -180 to 180 to make the most efficient turns.
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        if (delta > 0) {
            // Turn clockwise
            this.angle += this.TURN_RATE;
        } else {
            // Turn counter-clockwise
            this.angle -= this.TURN_RATE;
        }

        // Just set angle to target angle if they are close
        if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
            this.rotation = targetAngle;
        }
    }

    // Calculate velocity vector based on this.rotation and this.SPEED
    this.body.velocity.x = Math.cos(this.rotation) * this.speed;
    this.body.velocity.y = Math.sin(this.rotation) * this.speed;
    */
    // draw a rectangle
    //this.graphics.clear();
    //graphics.lineStyle(1, this.color, 1);
    //graphics.drawRect(this.x, this.y, 1, 1);
};