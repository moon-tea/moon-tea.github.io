var Entity = {
  count: 0,
  create: function(data) {
    Entity.count++;
    var o = data.stats;
    o.name = o.type+Entity.count;
    o.act = function(view) {
      console.log("act!");
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

    return function() { return o;};
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
};