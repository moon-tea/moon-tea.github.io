
var directions = {
  "n":  Vector.create( 0, -1),
  "ne": Vector.create( 1, -1),
  "e":  Vector.create( 1,  0),
  "se": Vector.create( 1,  1),
  "s":  Vector.create( 0,  1),
  "sw": Vector.create(-1,  1),
  "w":  Vector.create(-1,  0),
  "nw": Vector.create(-1, -1)
};

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function elementFromChar(legend, ch) {
  //console.log(ch);
  //if (ch == " ")
  //  return null;
  //console.log(legend, legend[ch], legend[ch]["factory"]);
  var element = new legend[ch]["factory"]();
  element.originChar = ch;
  element.babyChar = legend[ch].babyChar;
  element.adultChar = legend[ch].adultChar;
  element.grownUp = false;
  return element;
}

function charFromElement(element) {
  if (element == null)
    return " ";
  else
    return element.originChar;
}



function Wall() {
  this.type = "wall"
}
function Empty() {
  this.type = "empty"
}





function View(world, vector) {
  this.world = world;
  this.vector = vector;
}

View.prototype.look = function(dir) {
  var target = this.vector.plus(directions[dir]);
  if (this.world.grid.isInside(target)) {
    //console.log(this.world.grid.get(target));
    return this.world.grid.get(target);
  } else {
    return "#";
  }
};

View.prototype.findAll = function(props) {
  var found = [];
  for (var dir in directions)
    //console.log(this);
    //console.log(this.look(dir), props.type)
    if (this.look(dir) && this.look(dir).type == props.type){
      //console.log("foundPlant!")
      found.push(dir);
    }
  return found;
};

View.prototype.find = function(props) {
  var found = this.findAll(props);
  if (found.length == 0) return null;
  return randomElement(found);
};





//function LifelikeWorld(map, legend) {
//  World.create.call(this, map, legend);
//}
//LifelikeWorld.prototype = Object.create(World.prototype);
var LifelikeWorld = {
    create: function(map, legend) {
      var g = Object.assign(
        World.create(map, legend),
        {
          letAct: function(critter, vector) {
            var action = critter.act(new View(this, vector));
            //console.log(action);
            var handled = action &&
              action.type in actionTypes &&
              actionTypes[action.type].call(this, critter, vector, action);
            if (!handled) {
              critter.energy -= 0.2;
              if (critter.energy <= 0)
                this.grid.set(vector, elementFromChar(this.legend, " "));
            }
          }
        }
      );
      console.log(g);
      return g;
    }
};

//Object.assign( {}, World.create(map, legeng));
//function LifelikeWorld(map, legend) {
//  World.create.call(this, map, legend);
//}
/*
LifelikeWorld.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  var handled = action &&
    action.type in actionTypes &&
    actionTypes[action.type].call(this, critter,
                                  vector, action);
  if (!handled) {
    critter.energy -= 0.2;
    if (critter.energy <= 0)
      this.grid.set(vector, elementFromChar(this.legend, " "));
  }
};
*/







var actionTypes = {};//Object.create(null);

actionTypes.grow = function(critter) {
  critter.energy += 0.5;
  return true;
};

actionTypes.move = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  //var destObj = this.grid.get(dest);
  if (dest == null ||
      critter.energy <= 1 ||
      (this.grid.get(dest) && this.grid.get(dest).type != "empty"))
    return false;
  critter.energy -= 1;
  this.grid.set(vector, elementFromChar(this.legend, " "));
  this.grid.set(dest, critter);
  return true;
};

actionTypes.eat = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  var atDest = dest != null && this.grid.get(dest);
  if (!atDest || atDest.energy == null) {
    console.log("bork?");return false;
  }
  critter.energy += atDest.energy;
  this.grid.set(dest, elementFromChar(this.legend, " "));
  return true;
};

actionTypes.reproduce = function(critter, vector, action) {
  var baby = elementFromChar(this.legend, critter.babyChar);
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 2 * baby.energy ||
      this.grid.get(dest).type != "empty")
    return false;
  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};

actionTypes.growUp = function(critter) {
  console.log("grew up!")
  critter.originChar = critter.adultChar;
  critter.grownUp = true;
}









function Plant() {
  this.type = "plant";
  this.energy = 3 + Math.random() * 4;
}

Plant.prototype.act = function(view) {
  if (this.energy > 15) {
    var space = view.find( { type:"empty" } );
    if (space)
      return {type: "reproduce", direction: space};
  }
  if (this.energy < 20)
    return {type: "grow"};
};







function Herbivore() {
  this.energy = 30;
  this.type = "herbivore"
  this.direction = "e";
}

Herbivore.prototype.act = function(view) {
  var space = view.find({ type: "empty" });
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
};







function Carnivore() {
  this.energy = 100;
  this.direction = "w";
  // Used to track the amount of prey seen per turn in the last six turns
  this.preySeen = [];
}
Carnivore.prototype.act = function(view) {
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
};






/*
var valley = new LifelikeWorld(
  ['#####',
   '# r #', 
   '#"" #', 
   '#####'],
   {
    " ": { "factory": Empty},
    "#": { "factory": Wall },
    "R": { "factory": Herbivore, "babyChar": "r", "adultChar": "R" }, 
    "r": { "factory": Herbivore, "babyChar": "r", "adultChar": "R" }, 
    '"': { "factory": Plant, "babyChar": '"'}
  }
);
*/


var valley = LifelikeWorld.create(
  ['####################################################',
   '#                 ####         """"              ###',
   '#   "  w  ##                 ########       rr    ##',
   '#   "    ##        r r                 """"       "#',
   '#       ##"                        ##########     "#',
   '#      ##"""  "         """"                     ""#',
   '#" ""  #  "  """      #########                  ""#',
   '#" ""  #      "               #   "              ""#',
   '#     ##              #   r   #  """          ######',
   '#"            w       #       #   "        r  #    #',
   '#"                    #  ######                 "" #',
   '###          """"          """                  "" #',
   '#       r                        w         r       #',
   '#   "     ##  ##  ##  ##               ###      "  #',
   '#   ""         #              "       #####  r     #',
   '##  ""  r   r  #  #    """  """        ###      "" #',
   '###               #   """""                    """"#',
   '####################################################'],
  { 
    " ": { "factory": Empty },
    "#": { "factory": Wall },
    "W": { "factory": Carnivore, "babyChar": "w", "adultChar": "W" },
    "w": { "factory": Carnivore, "babyChar": "w", "adultChar": "W" },
    "R": { "factory": Herbivore, "babyChar": "r", "adultChar": "R" }, 
    "r": { "factory": Herbivore, "babyChar": "r", "adultChar": "R" }, 
    '"': { "factory": Plant, "babyChar": '"'}
  }
);

