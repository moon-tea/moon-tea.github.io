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

var valley = World.create(
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
    " ": { "factory": Empty.create },
    "#": { "factory": Wall.create },
    "W": { "factory": Carnivore.create, "babyChar": "w", "adultChar": "W" },
    "w": { "factory": Carnivore.create, "babyChar": "w", "adultChar": "W" },
    "R": { "factory": Herbivore.create, "babyChar": "r", "adultChar": "R" }, 
    "r": { "factory": Herbivore.create, "babyChar": "r", "adultChar": "R" }, 
    '"': { "factory": Plant.create, "babyChar": '"'}
  }
);
