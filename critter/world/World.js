var World = { 
    create: function(map, legend) {
        var grid = Grid.create(map[0].length, map.length);
        map.forEach( function(line, y) {
            for (var x = 0; x < line.length; x++) {
                grid.set(Vector.create(x, y), elementFromChar(legend, line[x]));
            }
        });
        var menu = { width: 20, height: grid.getHeight() };
        var display = new ROT.Display({width: grid.getWidth()+menu.width, height: grid.getHeight()});
        /* last argument specifies maximum length */
        //Goodbye %c{red}cr%b{blue}u%b{}el %c{}world
        display.drawText(0, 0, "%c{red}w%c{}%c{yellow}:%c{} wolf \n %c{lightblue}r%c{}%c{yellow}:%c{} rabbit", menu.width-1);
        /*window.addEventListener("mousemove", function(e) {
            var arr = display.eventToPosition(e);
            var vecReal = Vector.create(arr[0], arr[1]);
            var vecWorld = Vector.create(arr[0]-menu.width, arr[1]);
            var element = grid.get(vecWorld);
            console.log(element);
            display.draw(vecReal.x, vecReal.y, charFromElement(element), element.foregroundColor, "#FFFFAA");
        });*/
        window.addEventListener("click", function(e) {
            var arr = display.eventToPosition(e);
            var vecWorld = Vector.create(arr[0]-menu.width, arr[1]);
            var element = grid.get(vecWorld);
            console.log(element);
        });
        return {
            grid: grid,
            legend: legend,
            display: display,
            color:true,
            menu: menu,
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
                var action = critter.act(View.create(this, vector));
                var handled = action &&
                    action.type in actionTypes &&
                    actionTypes[action.type].call(this, critter, vector, action);
                if (!handled) {
                    critter.energy -= 0.2;
                    if (critter.energy <= 0)
                        this.grid.set(vector, elementFromChar(this.legend, " "));
                }
            },
            checkDestination: function(action, vector) {
                if (directions.hasOwnProperty(action.direction)) {
                    var dest = vector.plus(directions[action.direction]);
                    if (this.grid.isInside(dest))
                        return dest;
                }
            },
            tick: function() {
                //var display = new ROT.Display({width:this.grid.getWidth(), height:this.grid.getHeight()});
                for (var y = 0; y < this.grid.getHeight(); y++) {
                    for (var x = 0; x < this.grid.getWidth(); x++) {
                        var element = this.grid.get(Vector.create(x, y));
                        if(this.color){
                            this.display.draw(x+this.menu.width, y, charFromElement(element), element.foregroundColor, element.backgroundColor);
                        } else {
                            this.display.draw(x+this.menu.width, y, charFromElement(element), "#000000", "#FFFFFF");
                        }
                        //output += charFromElement(element);
                    }
                    //output += "\n";
                }
                //display.draw(5,  4, "@");
                //display.draw(15, 4, "%", "#0f0");          /* foreground color */
                //display.draw(25, 4, "#", "#f00", "#009");
                //return this.display.getContainer();
            },
            getDisplay: function() {
                return this.display.getContainer();
            }
        }
    }
};
