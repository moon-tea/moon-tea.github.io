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
                currrentCaloriesOfFat: 3500,
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
                currentEnergy: 0,
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

                updateState: function(time) {
                    console.log(rabbit.state.calorieCountOfFoodInStomach, rabbit.state.currentEnergy);
                    if(rabbit.state.calorieCountOfFoodInStomach > 0) {
                        rabbit.state.calorieCountOfFoodInStomach -= rabbit.calorieDecay(time);
                    } else if (rabbit.state.currrentCaloriesOfFat > 0) {
                        rabbit.state.currrentCaloriesOfFat -= rabbit.calorieDecay(time);
                    } else {
                        rabbit.kill();
                    }
                    rabbit.state.currentEnergy -= rabbit.energyDecay(time);
                },

                calorieDecay: function(time) {
                    return rabbit.basalMetabolicRate / time.FRAMES_PER_SECOND /
                        time.SECONDS_PER_MINUTE /
                        time.MINUTES_PER_HOUR /
                        time.HOURS_PER_DAY;
                },

                energyDecay: function(time) {
                    return 100 / time.FRAMES_PER_SECOND /
                        time.SECONDS_PER_MINUTE /
                        time.MINUTES_PER_HOUR /
                        time.HOURS_PER_DAY / (3/2);
                },


                //AI
                _current_plan: [],
                _target: null,
                plan: function() {
                    var planner = new Planner();

                    var plan = planner.plan(this, {
                        calorieCountOfFoodInStomach: this.basalMetabolicRate
                        //currentEnergy: 80
                    });
                    console.log(plan);
                    return plan;
                },

                decay: function(time) {

                }

                //a rabbit needs energy 
                //a rabbit needs calories
                //a rabbit needs vitamin A
                //a rabbit needs social interaction

                //a rabbit wants to reproduce, but won't unless it has everything it needs

                //a rabbit resolves energy by sleeping ~8 hours a night
                    //sleeping should prefer to occur in a den, which is safe from many predators
                        //if about to die from fatigue, any place can be a bed, though
                //a rabbit resolves calories by eating about 8 hours a day above ground
                    //a rabbit prefers to eat about 80% hay.(passive action that reduces speed)
                        //if starving for too long, a rabbit will eat much less efficient food
                //a rabbit has a need for Vitamin A(carrots)
                    //a rabbit needs about a carrot a day to provide its vitamin A
                        //if out of vitamin A for too long, a Rabbit has its stats and exp clamped
                //a rabbit will seek to be social with other rabbits
                    //a rabbit can socialize while inside a den. this could create more rabbits?
                        //if there are no rabbits to socialize with, a rabbit will wander

                //a rabbit can sense its environment with sight.
                    //this is an AoE that can be blocked, is worse at night, and can be confused by camo
                //a rabbit can sense its environment with smell. 
                    //this is a large, directional AoE
                    //smell only allows you to obtain info about things in the opposite direction of wind
                //a rabbit can sense its environment with sound.
                    //this is a large AoE that only works on an agent emitting sound.

                //a rabbit emits a certain amount of sound when it does certain actions
                //a rabbit of a certain color can blend in better with areas that match its color???

                //this lends itself to a certain normalized amount of utility based upon status
                //and decay.





            }
        );
        //Object.assign(rabbit, AgentMaker.Agent("phil"));
        rabbit._game = game;
        rabbit._sprite = rabbit.graphics;
        rabbit.setState("calorieCountOfFoodInStomach", 0);
        rabbit.setState("currentEnergy", 0);
        rabbit.setState("currrentCaloriesOfFat", 3500);
        rabbit.setState("daysAlive", 0);
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
