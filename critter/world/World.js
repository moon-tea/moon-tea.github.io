var World = { 
    create: function(map, legend) {
        var grid = Grid.create(map[0].length, map.length);
        map.forEach( function(line, y) {
            for (var x = 0; x < line.length; x++) {
                grid.set(Vector.create(x, y), elementFromChar(legend, line[x]));
            }
        });

        return {
            grid: grid,
            legend: legend,
            toString: function() {
                var output = "";
                for (var y = 0; y < this.grid.getHeight(); y++) {
                    for (var x = 0; x < this.grid.getWidth(); x++) {
                        var element = this.grid.get(Vector.create(x, y));
                        output += charFromElement(element);
                    }
                    output += "\n";
                }
                return output;
            },
            turn: function() {
                //console.log("turn");
                var acted = [];
                this.grid.forEach(function(critter, vector) {
                    if (critter.act && acted.indexOf(critter) == -1) {
                        acted.push(critter);
                        this.letAct(critter, vector);
                    }
                }, this);
            },
            letAct: function(critter, vector) {
                //console.log("letAct");
                var action = critter.act(new View(this, vector));
                if (action && action.type == "move") {
                    //console.log("move");
                    var dest = this.checkDestination(action, vector);
                    if (dest && 
                        this.grid.get(dest) &&
                        this.grid.get(dest).type == "empty") {
                        this.grid.set(vector, elementFromChar(this.legend, " "));
                        this.grid.set(dest, critter);
                    }
                }
            },
            checkDestination: function(action, vector) {
                if (directions.hasOwnProperty(action.direction)) {
                    var dest = vector.plus(directions[action.direction]);
                    if (this.grid.isInside(dest))
                        return dest;
                }
            }
        }
    }
};
