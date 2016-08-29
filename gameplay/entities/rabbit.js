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
                
                //start physics
                SPEED: 1, // 1 foot per second
                TURN_RATE: 45,//15, // turn rate in degrees/frame
                WOBBLE_LIMIT: 5, // degrees
                WOBBLE_SPEED: 250, // milliseconds
                AVOID_DISTANCE: 1, // pixels
                feetTraveled: 0, //feet
                wobble: 5,//this.WOBBLE_LIMIT, 

                //start graphics
                color: colors[rand],
                
                //start dietary needs
                currentWeight: 6.0, //lbs
                minimumWeight: 5, //lbs
                get basalMetabolicRate() { return 50 },//{ return 26 * this.currentWeight + 43 }, //formula: 26 cal * lbs + base 43 cal 
                get poundsOfFat() { return this.curentWeight - this.minimumWeight }, //lbs
                //calorieNeedsPerDay: 50, //cal
                calorieCountOfFoodInStomach: 0, //cal
                stomachCapacity: 400, //cal
                digestionRatePerDay: 400, //cal
                foodNormalMin: -100,
                foodNormalMax: 100,

                get foodNormal() {
                    return this.getProjection(
                        0,
                        this.stomachCapacity,
                        this.foodNormalMin,
                        this.foodNormalMax,
                        this.calorieCountOfFoodInStomach
                    );
                },

                newFoodNormal: function(plusCal) {
                    return this.getProjection(0, this.stomachCapacity, this.foodNormalMin, this.foodNormalMax, this.calorieCountOfFoodInStomach+plusCal);
                },

                getProjection: function(minimumValue, maximumValue, minimumProjectedValue, maximumProjectedValue, currentValue) {   
                    // To gain a numberline projection you use the formula : 
                    // @formula f(v) = c + (d-c)*Math.abs((v-a)/(b-a))
                    // Where [a,b] = [minimumValue, maximumValue] and [c,d] = [minimumProjectedPixelValue, maximumProjectedPixelValue]
                    // and v is our value.
                    var a = minimumValue; 
                    var b = maximumValue;
                    var c = minimumProjectedValue;
                    var d = maximumProjectedValue;
                    var v = currentValue;
                    //bascially, the new min + the new max * a percantage based on the currentValue
                    return c + (d - c) * Math.abs((v - a) / (b - a));
                },

                //start sleeping/energy needs
                energyMax: 100,
                energyMin: -100,
                currentEnergy: 100,
                get energyNormal() { return this.currentEnergy; },
                newEnergyNormal: function(plusEnergy) { return this.currentEnergy+plusEnergy; },
                basalEnergyBurnPerDay: 100,

                //start sorcial needs

                //create the happiness grapher
                get currentHappiness() {
                    var happinessMax = 100;
                    //TODO: read in these functions so they are easy to change
                    var hungerImpact = .0025*(this.foodNormal-100)*(this.foodNormal-100)+5;//(this.foodNormal * this.foodNormal);
                    var sleepinessImpact = .0001*(this.energyNormal-100)*(this.energyNormal-100);
                    var happiness = happinessMax - hungerImpact - sleepinessImpact;
                    console.log(happiness);
                    return happiness;
                },

                //see what will happen if we do a certain action
                possibleHappiness: function(rewards) {
                    var happinessMax = 100;
                    var hungerImpact = 0;
                    var sleepinessImpact = 0;
                    if(rewards.calorieCount) {
                        hungerImpact = .0025*(this.newFoodNormal(rewards.calorieCount)-100)*(this.newFoodNormal(rewards.calorieCount)-100)+5;//(this.foodNormal * this.foodNormal);
                    } else {
                        hungerImpact = .0025*(this.foodNormal-100)*(this.foodNormal-100)+5;//(this.foodNormal * this.foodNormal);
                    }
                    if(rewards.energy) {
                        sleepinessImpact = .0001*(this.newEnergyNormal(rewards.energy)-100)*(this.newEnergyNormal(rewards.energy)-100);
                    } else {
                        sleepinessImpact = .0001*(this.energyNormal-100)*(this.energyNormal-100);
                    }
                    var happiness = happinessMax - hungerImpact - sleepinessImpact;
                    var diff = happiness - this.currentHappiness;
                    console.log(diff);
                    return diff;
                },

                //AI
                _current_plan: [],
                _target: null,
                plan: function() {
                    var planner = new Planner();

                    var plan = planner.plan(this, {
                        name: "calorieCountOfFoodInStomach",
                        value: this.basalMetabolicRate
                    });
                    //console.log(plan);
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
