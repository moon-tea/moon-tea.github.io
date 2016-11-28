var Wall = {
  bgColors:["#989ea3","#9a999c","#bab8bc","#a2a6ae","#aeaeb1"],
  fgColors:["#5b3000","#66462c","#755839","#bb9457","#99582a"],
  create: function() {
	var fgc = randomElement(Wall.fgColors);
  	var bgc = randomElement(Wall.bgColors);
    return {
      type: "wall",
      foregroundColor: fgc,
      backgroundColor: bgc
    }
  }
};
