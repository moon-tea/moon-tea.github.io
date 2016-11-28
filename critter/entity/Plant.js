var Plant = {
  count: 0,
  create: function() {
    Plant.count++;
    return {
      name: "Plant"+Plant.count,
      type: "plant",
      energy: 3 + Math.random() * 4,
      walkable: true,
      foregroundColor: "#22370e",
      backgroundColor: randomElement(Empty.bgColors),
      act: function(view) {
        if (this.energy > 15) {
          var space = view.find( { type:"empty" } );
          if (space)
            return {type: "reproduce", direction: space};
        }
        if (this.energy < 20)
          return {type: "grow"};
      }
    }
  }
};
