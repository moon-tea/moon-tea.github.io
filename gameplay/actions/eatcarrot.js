EatCarrotAction = function(id, x, y) {
    Action.call(this, "EatCarrot"+id, 4);

    this._position = {x:x, y:y};
    this.addEffect("calorieCount", 23);
};

EatCarrotAction.prototype = Object.create(Action.prototype);

EatCarrotAction.prototype.execute = function() {
    //console.log("eating carrot: "+this.name);
    //this.agent.removeAction(this);
    var that = this;
    this.agents.forEach(function(agent) {
        agent.removeAction(that);
    });
    console.log(this);
    this.object.kill();
}
