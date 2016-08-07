var GameState = function(game) {
    this.MAX_RABBITS = 25; // number of rabbits
    //this.MAX_RABBITS = 10; // number of rabbits
    this.CARROTS_NEEDED = 50; // number of carrots
    this.STARTING_RABBITS = 25; // number of rabbits
    //TIME
    var realTime = {
        FRAMES_PER_SECOND: 60,
        SECONDS_PER_MINUTE: 60,
        MINUTES_PER_HOUR: 60,
        HOURS_PER_DAY: 24,
        DAYS_PER_SEASON: 91,
        DAYS_PER_YEAR: 364, 
        PIXELS_PER_FEET: 1,
        SEASONS: ["SPRING", "SUMMER", "FALL", "WINTER"]
    };

    var bigTime = {
        FRAMES_PER_SECOND: 1/32,
        SECONDS_PER_MINUTE: 60, 
        MINUTES_PER_HOUR: 60,
        HOURS_PER_DAY: 24,
        DAYS_PER_SEASON: 91,
        DAYS_PER_YEAR: 364, 
        PIXELS_PER_FEET: 1/32,
        SEASONS: ["SPRING", "SUMMER", "FALL", "WINTER"]
    };

    var minecraftTime = {
        FRAMES_PER_SECOND: 60,
        SECONDS_PER_MINUTE: 16.6,
        MINUTES_PER_HOUR: 6,
        HOURS_PER_DAY: 4,
        DAYS_PER_SEASON: 4,
        DAYS_PER_YEAR: 16,
        PIXELS_PER_FEET: 200,
        SEASONS: ["SPRING", "SUMMER", "FALL", "WINTER"]     
    };

    //Set the time variable
    this.time = bigTime;
    this.FRAMES_PER_SECOND = this.time.FRAMES_PER_SECOND; 
    this.SECONDS_PER_MINUTE = this.time.SECONDS_PER_MINUTE; 
    this.MINUTES_PER_HOUR = this.time.MINUTES_PER_HOUR; 
    this.HOURS_PER_DAY = this.time.HOURS_PER_DAY; 
    this.DAYS_PER_SEASON = this.time.DAYS_PER_SEASON; 
    this.DAYS_PER_YEAR = this.time.DAYS_PER_YEAR; 
    this.PIXELS_PER_FEET = this.time.PIXELS_PER_FEET; 
    this.SEASONS = this.time.SEASONS; 
};

// Load images and sounds
GameState.prototype.preload = function() {
    //this.game.load.image('rocket', 'assets/gfx/rocket.png');
    //this.game.load.spritesheet('explosion', 'assets/gfx/explosion.png', 128, 128);
};

// Setup the example game
GameState.prototype.create = function() {
    // Set stage background to something sky colored
    this.game.stage.backgroundColor = "0x489030";
    
    // Create a group to hold the rabbit
    this.rabbitGroup = this.game.add.group();

    // Create a group to hold the carrots
    this.carrotGroup = this.game.add.group();

    // Create a group to hold the dens
    this.rabbitDenGroup = this.game.add.group();

    //time variables
    this.frameCount = 0;
    this.secondCount = 0;
    this.minuteCount = 0;
    this.hourCount = 0;
    this.dayCount = 0;
    this.yearCount = 0;
    this.carrots_eaten = 0;
    this.output = "";
    this.text = game.add.text(20, game.world.height-20, this.output, { font: "12px Arial", fill: "#000000", align: "left" });
    
    //set the game seed
    ROT.RNG.setSeed(12345);
};

// The update() method is called every frame
GameState.prototype.update = function() {
    //Every frame -- this number gets pretty big.
    this.frameCount++;
    this.text.destroy();
    
    //Putting this in a function is probably a good idea at some point
    this.secondCount = Math.floor(this.frameCount / this.FRAMES_PER_SECOND);
    this.minuteCount = Math.floor(this.secondCount / this.SECONDS_PER_MINUTE);
    this.hourCount = Math.floor(this.minuteCount / this.MINUTES_PER_HOUR);
    this.dayCount = Math.floor(this.hourCount / this.HOURS_PER_DAY);
    this.yearCount = Math.floor(this.dayCount / this.DAYS_PER_YEAR);
    this.season = this.SEASONS[Math.floor(( this.dayCount % (this.DAYS_PER_SEASON * this.SEASONS.length) / this.DAYS_PER_SEASON ))]
                
    // If there are fewer than MAX_RABBITS, launch a new one
    if (this.rabbitGroup.countLiving() < this.MAX_RABBITS) {
        //this.launchRabbit(this.game.world.centerX, this.game.world.centerY, ((60 / this.FRAMES_PER_SECOND ) / this.PIXELS_PER_FEET) );
        this.launchRabbit(0, this.game.world.centerY, ((60 / this.FRAMES_PER_SECOND ) * this.PIXELS_PER_FEET) );
    }
    
    this.output = "";
    this.output += "game time-:"+this.yearCount+"y, "+this.dayCount+"d, "+this.hourCount+"h, "+this.minuteCount+"m, "+this.secondCount+"s";
    this.output += "\nseason: " + this.season;
    this.output += "\nmapsize: " + this.game.world.width/this.PIXELS_PER_FEET+"sqft";
    this.output += "\ncarrots consumed: " + this.carrots_eaten;
    var count = this.output.split("\n").length;
    this.text = game.add.text(5, game.world.height-(count*20), this.output, { font: "12px Arial", fill: "#000000", align: "left" });

    this.rabbitGroup.forEachAlive(function(rabbit) {
        rabbit.feetTraveled += rabbit.speed/60/this.PIXELS_PER_FEET;
        //console.log(rabbit.calorieCountOfFoodInStomach, Math.floor(rabbit.speed), Math.floor(rabbit.feetTraveled/5280), (rabbit.feetTraveled / this.secondCount), (rabbit.feetTraveled/5280/(this.minuteCount/60)));
        if(!rabbit.carrot) {
            var spawnX = Math.floor(ROT.RNG.getUniform()*(this.game.world.width-100) + 50);
            var spawnY = Math.floor(ROT.RNG.getUniform()*(this.game.world.height-100) + 50);
            //var spawnX = this.game.world.width-2;
            //var spawnY = this.game.world.centerY; 
            var c = this.spawnCarrot(spawnX, spawnY);
            rabbit.carrot = c;
            //rabbit.distance = this.game.math.distance(rabbit.x, rabbit.y, rabbit.carrot.x, rabbit.carrot.y);
            rabbit.targetX = rabbit.carrot.x;
            rabbit.targetY = rabbit.carrot.y;
        } else {
            var distance = this.game.math.distance(rabbit.x, rabbit.y, rabbit.carrot.x, rabbit.carrot.y);
            if (distance < rabbit.carrot.EAT_DISTANCE) {
                console.log("kill!");
                rabbit.carrot.kill();
                rabbit.calorieCountOfFoodInStomach += rabbit.carrot.CALORIE_COUNT;
                rabbit.carrot = null;
                this.carrots_eaten++;
            }
        }
        if(!rabbit.den) {
            var spawnX = Math.floor(ROT.RNG.getUniform()*(this.game.world.width-100) + 50);
            var spawnY = Math.floor(ROT.RNG.getUniform()*(this.game.world.height-100) + 50);
            //var spawnX = this.game.world.width-2;
            //var spawnY = this.game.world.centerY; 
            var d = this.spawnDen(spawnX, spawnY);
            rabbit.den = d;
        } else {
            var distance = this.game.math.distance(rabbit.x, rabbit.y, rabbit.den.x, rabbit.den.y);
            if (distance < rabbit.den.SAFE_DISTANCE) {
                //console.log("safe!");
            }
        }
    }, this);

    //this.carrotGroup.forEachAlive(function(carrot) {
    //
    //}, this);
};

// Try to get a rabbit from the rabbitGroup
// If a rabbit isn't available, create a new one and add it to the group.
GameState.prototype.spawnCarrot = function(x, y) {
    // // Get the first dead carrot from the carrotGroup
    var carrot = this.carrotGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (carrot === null) {
        carrot = new Carrot(this.game);
        this.carrotGroup.add(carrot);
    }

    // Revive the carrot (set it's alive property to true)
    // You can also define a onRevived event handler in your carrot objects
    // to do stuff when they are revived.
    carrot.revive();

    // Move the carrot to the given coordinates
    carrot.x = x;
    carrot.y = y;
    carrot.claimed = false;

    return carrot;
};

GameState.prototype.spawnDen = function(x, y) {
    // // Get the first dead carrot from the carrotGroup
    var den = this.rabbitDenGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (den === null) {
        den = new Den(this.game);
        this.rabbitDenGroup.add(den);
    }

    // Revive the carrot (set it's alive property to true)
    // You can also define a onRevived event handler in your carrot objects
    // to do stuff when they are revived.
    den.revive();

    // Move the carrot to the given coordinates
    den.x = x;
    den.y = y;
    den.claimed = false;

    return den;
};

 // Try to get a rabbit from the rabbitGroup
// If a rabbit isn't available, create a new one and add it to the group.
GameState.prototype.launchRabbit = function(x, y, FEET_PER_SECOND) {
    // // Get the first dead rabbit from the rabbitGroup
    var rabbit = this.rabbitGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (rabbit === null) {
        rabbit = new Rabbit(this.game);
        this.rabbitGroup.add(rabbit);
    }

    // Revive the rabbit (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    rabbit.revive();

    // Move the rabbit to the given coordinates
    rabbit.x = x;
    rabbit.y = y;
    rabbit.distance = 100000;
    rabbit.feetTraveled = 0;
    //              walking speed of 4.4 feet per second
    // multiplied by the time/pixels ration
    rabbit.speed = 1 * FEET_PER_SECOND; //pixels per second

    return rabbit;
};