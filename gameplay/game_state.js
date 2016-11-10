var GameState = function(game) {
    this.MAX_RABBITS = 1; // number of rabbits
    this.MAX_DENS = 2; // number of rabbits
    this.MAX_CARROTS = 8; // number of carrots
    this.STARTING_RABBITS = 1; // number of rabbits
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
        HOURS_PER_DAY: 8,
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
    this.worldTime = bigTime;
};

// Load images and sounds
GameState.prototype.preload = function() {
    //this.game.load.image('rocket', 'assets/gfx/rocket.png');
    //this.game.load.spritesheet('explosion', 'assets/gfx/explosion.png', 128, 128);
    
    var myObj = { 
      getObj: function() {
        return {
          target: '#graph',
          disableZoom: true,
          xAxis: {
            label: 'x - axis',
            domain: [0, 1]
          },
          yAxis: {
            label: 'y - axis',
            domain: [0, 1]
          },
          width: 400,
          height: 400,
          data: [{
            graphType: 'polyline',
            fn: function(scope){
              //return makeCurve(scope.x,'linear', 0.5, 1.0, 0.25, 0.0);
              return lin.getPlot(scope.x);
            }
          },
          {
            graphType: 'polyline',
            fn: function (scope) {
              return log.getPlot(scope.x);//makeCurve(scope.x,'logistic',50,-0.95,1.0,0.6);//1/Math.pow(base, x);
            },
            //fn: '2^(x)',//makeCurve('logistic',50,-0.95,1.0,0.6 ),
            //fnType: 'parametric',
            range: [0,1]
          }]
        }
      }
  }
      $( "#m" ).keyup( function() {
      console.log("boop");
      console.log($( this ).val()); 
      lin = CurveMaker.Curve('linear', $( this ).val(), 1.0, 0.25, 0.0 );
      functionPlot(myObj.getObj()); 
     });
    functionPlot(myObj.getObj());
}

// Setup the example game
GameState.prototype.create = function() {
    //set the game seed
    ROT.RNG.setSeed(12344);
    
    // Set stage background to something grass
    this.game.stage.backgroundColor = "0x489030";
    
    // Create a group to hold the rabbit
    this.rabbitGroup = this.game.add.group();

    // Create a group to hold the carrots
    this.carrotGroup = this.game.add.group();

    // Create a group to hold the dens
    this.rabbitDenGroup = this.game.add.group();

    //time variables
    this.worldTime.frameCount = 0;
    this.worldTime.secondCount = 0;
    this.worldTime.minuteCount = 0;
    this.worldTime.hourCount = 0;
    this.worldTime.dayCount = 0;
    this.worldTime.yearCount = 0;
    this.carrots_eaten = 0;
    this.output = "";
    this.text = game.add.text(20, game.world.height-20, this.output, { font: "12px Arial", fill: "#000000", align: "left" });
    
    var spawn = {x:0, y:0};
    while(this.rabbitGroup.countLiving() < this.MAX_RABBITS) {
        spawn = this.getRandomPos();
        this.spawnRabbit(spawn.x, spawn.y, ((60 / this.worldTime.FRAMES_PER_SECOND ) * this.worldTime.PIXELS_PER_FEET) );
    }

    while(this.carrotGroup.countLiving() < this.MAX_CARROTS) {
        //console.log("x");
        spawn = this.getRandomPos();
        this.spawnCarrot(spawn.x, spawn.y);
    }
    this.timeSinceLastCarrot = 0;

    while(this.rabbitDenGroup.countLiving() < this.MAX_DENS) {
        spawn = this.getRandomPos();
        this.spawnDen(spawn.x, spawn.y);
    }
};


// The update() method is called every frame
GameState.prototype.update = function() {
    //Every frame -- this number gets pretty big.
    this.worldTime.frameCount++;
    
    //Putting this in a function is probably a good idea at some point
    this.worldTime.secondCount = Math.floor(this.worldTime.frameCount / this.worldTime.FRAMES_PER_SECOND);
    this.worldTime.minuteCount = Math.floor(this.worldTime.secondCount / this.worldTime.SECONDS_PER_MINUTE);
    this.worldTime.hourCount = Math.floor(this.worldTime.minuteCount / this.worldTime.MINUTES_PER_HOUR);
    this.worldTime.dayCount = Math.floor(this.worldTime.hourCount / this.worldTime.HOURS_PER_DAY);
    this.worldTime.yearCount = Math.floor(this.worldTime.dayCount / this.worldTime.DAYS_PER_YEAR);
    this.worldTime.season = this.worldTime.SEASONS[Math.floor(( this.worldTime.dayCount % (this.worldTime.DAYS_PER_SEASON * this.worldTime.SEASONS.length) / this.worldTime.DAYS_PER_SEASON ))]
                
    // If there are fewer than MAX_RABBITS, spawn a new one
    if (this.rabbitGroup.countLiving() < this.MAX_RABBITS) {
        //this.spawnRabbit(this.game.world.centerX, this.game.world.centerY, ((60 / this.worldTime.FRAMES_PER_SECOND ) / this.worldTime.PIXELS_PER_FEET) );
        //this.spawnRabbit(0, this.game.world.centerY, ((60 / this.worldTime.FRAMES_PER_SECOND ) * this.worldTime.PIXELS_PER_FEET) );
        //
    }

    //this.timeSinceLastCarrot++;
    //console.log(this.timeSinceLastCarrot);
    if (this.timeSinceLastCarrot > 360) {//this.season == SPRING {
        this.timeSinceLastCarrot = 0;
        spawn = this.getRandomPos();
        this.spawnCarrot(spawn.x, spawn.y);
    }

    //destroy text
    this.text.destroy();
    this.output = "";
    this.output += "game time:"+this.worldTime.yearCount+"y, "+this.worldTime.dayCount+"d, "+this.worldTime.hourCount+"h, "+this.worldTime.minuteCount+"m, "+this.worldTime.secondCount+"s";
    //this.output += "\nseason: " + this.worldTime.season;
    //this.output += "\nmapsize: " + this.game.world.width/this.worldTime.PIXELS_PER_FEET+"sqft";
    this.output += "\ncarrots consumed: " + this.carrots_eaten;
    //this.output += "\ncarrots consumed: " + this.carrots_eaten;
    var count = this.output.split("\n").length;
    this.text = game.add.text(5, game.world.height-(count*20), this.output, { font: "12px Arial", fill: "#000000", align: "left" });

    this.rabbitGroup.forEachAlive(function(rabbit) {
        rabbit.feetTraveled += rabbit.speed/60/this.worldTime.PIXELS_PER_FEET;
        rabbit.updateStateMachine();
        rabbit.updateState(this.worldTime);
        //console.log(rabbit.speed)
    }, this);
    
    //this.carrotGroup.forEachAlive(function(carrot) {
    //    if(carrot.calorie_count <= 0) { 
    //        carrot.kill();
    //    }
    //}, this);
};

// Try to get a rabbit from the rabbitGroup
// If a rabbit isn't available, create a new one and add it to the group.
GameState.prototype.spawnCarrot = function(x, y) {
    // // Get the first dead carrot from the carrotGroup
    var carrot = this.carrotGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (carrot === null) {
        //carrot = new Carrot(this.game, this.carrotGroup.countLiving(), x, y);
        //console.log(CarrotMaker);
        carrot = CarrotMaker.Carrot(this.game, this.carrotGroup.countLiving(), x, y);
        //console.log(carrot);
        this.carrotGroup.add(carrot);
    }

    // Revive the carrot (set it's alive property to true)
    // You can also define a onRevived event handler in your carrot objects
    // to do stuff when they are revived.
    carrot.revive();
    //console.log(carrot.advertisedActions);
    //console.log(SmartObject.advertisedActions);
    //carrots advertise their actions
    for(var i = 0; i < carrot.advertisedActions.length; i++) {
            //console.log(carrot.advertisedActions[i]);
        carrot.advertisedActions[i]._position={x:x,y:y};
    }
    this.rabbitGroup.forEachAlive(function(rabbit) {
        //for(var action in carrot.advertisedActions) {
        for(var i = 0; i < carrot.advertisedActions.length; i++) {
            //console.log(carrot.advertisedActions[i]);
            
            rabbit.addAction(carrot.advertisedActions[i]);
        }
        //}
        //console.log(rabbit);
    }, this);

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
        den = DenMaker.Den(this.game, this.rabbitDenGroup.countLiving(), x, y);
        this.rabbitDenGroup.add(den);
    }

    // Revive the carrot (set it's alive property to true)
    // You can also define a onRevived event handler in your carrot objects
    // to do stuff when they are revived.
    den.revive();

    this.rabbitGroup.forEachAlive(function(rabbit) {
        //for(var action in carrot.advertisedActions) {
        for(var i = 0; i < den.advertisedActions.length; i++) {
            //console.log(carrot.advertisedActions[i]);
            rabbit.addAction(den.advertisedActions[i]);
        }
        //}
        //console.log(rabbit);
    }, this);

    // Move the carrot to the given coordinates
    den.x = x;
    den.y = y;
    den.claimed = false;

    return den;
};

 // Try to get a rabbit from the rabbitGroup
// If a rabbit isn't available, create a new one and add it to the group.
GameState.prototype.spawnRabbit = function(x, y, FEET_PER_SECOND) {
    // // Get the first dead rabbit from the rabbitGroup
    var rabbit = this.rabbitGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (rabbit === null) {
        //carrot = new Carrot(this.game, this.carrotGroup.countLiving(), x, y);
        //console.log(RabbitMaker);
        rabbit = RabbitMaker.Rabbit(this.game, x, y);
        //console.log(rabbit);
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

GameState.prototype.getRandomPos = function() {
    var _x = Math.floor(ROT.RNG.getUniform()*(this.game.world.width-50) + 25);
    var _y = Math.floor(ROT.RNG.getUniform()*(this.game.world.height-50) + 25);
    return {x:_x, y:_y};
};