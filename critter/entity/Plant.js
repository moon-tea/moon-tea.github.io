var Plant = {
  count: 0,
  create: function() {
    Plant.count++;
    return {
      name: "Plant"+Plant.count,
      type: "plant",
      energy: 3 + Math.random() * 4,
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
