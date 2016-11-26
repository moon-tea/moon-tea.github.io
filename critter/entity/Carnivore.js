var Carnivore = {
  count: 0,
  create: function() {
    Carnivore.count++;
    return {
      name: "Carnivore"+Carnivore.count,
      energy: 100,
      direction: "w",
      // Used to track the amount of prey seen per turn in the last six turns
      preySeen: [],
      act: function(view) {
        // Average number of prey seen per turn
        var seenPerTurn = this.preySeen.reduce(function(a, b) {
          return a + b;
        }, 0) / this.preySeen.length;
        var prey = view.findAll({type: "herbivore"});
        this.preySeen.push(prey.length);
        // Drop the first element from the array when it is longer than 6
        if (this.preySeen.length > 6)
          this.preySeen.shift();

        // Only eat if the predator saw more than ¼ prey animal per turn
        if (prey.length && seenPerTurn > 0.25)
          return {type: "eat", direction: randomElement(prey)};
          
        var space = view.find({type:"empty"});
        if (this.energy > 300 && !this.grownUp)
          return {type: "growUp"};
        if (this.energy > 400 && space)
          return {type: "reproduce", direction: space};
        if (view.look(this.direction) != " " && space)
          this.direction = space;
        return {type: "move", direction: this.direction};
      }
    }
  }
};