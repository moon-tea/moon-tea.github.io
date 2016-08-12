EatCarrotAction = function(num) {
    Action.call(this, "EatCarrot"+num, 4);

    console.log(this);
    //this._mineCounter = 0;
    //this._position = positions.ore;
     var spawnX = Math.floor(ROT.RNG.getUniform()*(208-100) + 50);
            var spawnY = Math.floor(ROT.RNG.getUniform()*(208-100) + 50);
            this._position = {x:spawnX, y:spawnY};

    //this.addPrecondition("HasTool", true);
    //this.addPrecondition("HasOre", false);
    this.addEffect("calorieCount", 23);
};

EatCarrotAction.prototype = Object.create(Action.prototype);

EatCarrotAction.prototype.execute = function() {
    console.log("eating carrot: "+this.name);
    //this._mineCounter++;

    //if(this._mineCounter >= 4) {
    //    console.log("Tool broke while mining :(");
    //    this.agent.setState("HasTool", false);
    //    this._mineCounter = 0;
    //}
}
