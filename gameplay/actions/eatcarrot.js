EatCarrotAction = function(calCount) {
    Action.call(this, "EatCarrot", 4);

    console.log(calCount);
    //this._mineCounter = 0;
    //this._position = positions.ore;
    this._position = {x:150, y:150};

    //this.addPrecondition("HasTool", true);
    //this.addPrecondition("HasOre", false);
    //this.addEffect("calorieCount", calCount+23);
    this.addEffect("calorieCount", {type:"incremental", value:23});
    //this.addEffect("calorieCount", this.calcCal(this.agent));
    console.log(this.effects);
};

EatCarrotAction.prototype = Object.create(Action.prototype);

EatCarrotAction.prototype.execute = function() {
    console.log("eating carrot:");
    //this._mineCounter++;

    //if(this._mineCounter >= 4) {
    //    console.log("Tool broke while mining :(");
    //    this.agent.setState("HasTool", false);
    //    this._mineCounter = 0;
    //}
}
