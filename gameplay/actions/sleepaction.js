SleepAction = function(id, x, y) {
    Action.call(this, "Sleep"+id, 4);

    this._position = {x:x, y:y};
    this.addEffect("currentEnergy", 100);
};

SleepAction.prototype = Object.create(Action.prototype);

SleepAction.prototype.execute = function() {
    console.log("sleeping in den: "+this.name);
}
