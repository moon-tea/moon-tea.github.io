var Entity = {
  count: 0,
  create: function(data) {
    Entity.count++;
    var o = data.stats;
    var o.name = o.type+Entity.count;
    var o.act = function(view) {
      this.prey = view.findAll(this.food);
      this.preyLength = this.prey.length;
      this.preyToEatDirection = randomElement(this.prey);//view.findAll(this.food);
      this.space = view.find({ walkable: true });
      for(var i = 0; i < data.actions.length; i++) {
        if(data.actions[i].stats) {

          var match = true && data.actions[i].stats.every(function(stat) {
            return this[stat.name] > stat.needed;
          });

          if(match) {
            return {
              type:data.actions[i].type, 
              direction:o[data.actions[i].direction] 
            }
          }
        }
      }
    }

    return o;
  }
};

    return {
      name: "Carnivore"+Carnivore.count,
      energy: 100,
      direction: "w",
      foregroundColor: "#DD4444",
      // Used to track the amount of prey seen per turn in the last six turns
      preySeen: [],
      food: {type: "herbivore"},
      leaveBehindFood: 0,
      grownUp: false,
      energyToGrowUp: 300,

      act: function(view) {
        // Average number of prey seen per turn
        /*var seenPerTurn = this.preySeen.reduce(function(a, b) {
          return a + b;
        }, 0) / this.preySeen.length;*/
        var prey = view.findAll(this.food);
        //this.preySeen.push(prey.length);
        // Drop the first element from the array when it is longer than 6
        //if (this.preySeen.length > 6)
        //  this.preySeen.shift();

        // Only eat if the predator saw more than ¼ prey animal per turn
        if (prey.length > this.leaveBehindFood)// && seenPerTurn > 0.25)
          return {type: "eat", direction: randomElement(prey)};
          
        //var space = view.find({type:"empty"});
        var space = view.find({ walkable: true });
        if (this.energy > this.growUp.energyNeeded && !this.grownUp)
          return {type: "growUp"};
        if (this.energy > this.reproduce.energyNeeded && space)
          return {type: "reproduce", direction: space};
        if (view.look(this.direction) != " " && space)
          this.direction = space;
        return {type: "move", direction: this.direction};
      }
    }
  }
};

var wolf = {
  stats: {
    type: "carnivore",
    energy: 100,
    direction: "w",
    foregroundColor: "#DD4444",
    grownUp: false,
    food: {type: "herbivore"},
    leaveBehindFood: 0,
  },
  actions:[
    { type: "eat", direction: "preyToEatDirection", stats: [
        {name:"preyLength", needed: 0}
      ]
    },
    { type: "growUp", stats: [ 
        { name: "energy", needed: 300 } 
      ]
    },
    { type: "reproduce", direction: "space", stats: [ 
        { name: "energy", needed: 400 } 
      ]
    },
    { type: "move", direction:"space" }
  ]
}