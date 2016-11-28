var actionTypes = {
    grow: function(critter) {
        critter.energy += 0.5;
        return true;
    },
    move: function(critter, vector, action) {
        var dest = this.checkDestination(action, vector);
        var destObj = this.grid.get(dest);
        //console.log(destObj);
        critter.standingOn = destObj;
        critter.backgroundColor = critter.standingOn.backgroundColor;
        if (dest == null ||
                critter.energy <= 1 ||
                (this.grid.get(dest) && !this.grid.get(dest).walkable))
            return false;
        critter.energy -= 1;
        //this.grid.set(vector, elementFromChar(this.legend, destObj.originChar));
        this.grid.set(vector, elementFromChar(this.legend, critter.standingOn.originChar))
        this.grid.set(dest, critter);
        return true;
    },
    eat: function(critter, vector, action) {
        var dest = this.checkDestination(action, vector);
        var atDest = dest != null && this.grid.get(dest);
        if (!atDest || atDest.energy == null) {
            console.log("bork?");return false;
        }
        critter.energy += atDest.energy;
        this.grid.set(dest, elementFromChar(this.legend, " "));
        return true;
    },
    reproduce: function(critter, vector, action) {
        var baby = elementFromChar(this.legend, critter.babyChar);
        var dest = this.checkDestination(action, vector);
        var destObj = this.grid.get(dest);
        //console.log(destObj);
        baby.standingOn = destObj;
        baby.backgroundColor = baby.standingOn.backgroundColor;
        if (dest == null ||
                critter.energy <= 2 * baby.energy ||
                this.grid.get(dest).type != "empty")
            return false;
        critter.energy -= 2 * baby.energy;
        this.grid.set(dest, baby);
        return true;
    },
    growUp: function(critter) {
        //console.log(critter.name, "grew up!")
        critter.originChar = critter.adultChar;
        critter.grownUp = true;
    }
};
