var Herbivore = {
  count: 0,
  create: function() {
    Herbivore.count++;
    return {
      name: "Herbivore"+Herbivore.count,
      energy: 30,
      type: "herbivore",
      direction: "e",
      foregroundColor: "#3333FF",
      act: function(view) {
        var space = view.find({ walkable: true });
        if (this.energy > 60 && !this.grownUp)
          return {type: "growUp"};
        if (this.energy > 90 && space)
          return {type: "reproduce", direction: space};
        var plants = view.findAll( { type: "plant" } );
        if (plants.length > 1)
          return {type: "eat", direction: randomElement(plants)};
        //console.log(view.look(this.direction) );
        //if (view.look(this.direction) != " " && space)
        if (space)
          this.direction = space; //console.log(space)
        return {type: "move", direction: this.direction};
      }
    }
  }
};
