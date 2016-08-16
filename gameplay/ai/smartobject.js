var SmartObject = function(name) {
    this.name = name;
    this.advertisedActions = [];

    this.state = {};

    this.sm = new StateMachine();

    //should obejcts have states? possibly. Not quite the same as the other states, though
    //this.sm.add("idle", new IdleState(this));
    //this.sm.add("action", new ActionState(this));
    //this.sm.enter("idle");
};

SmartObject.prototype = Object.create(Phaser.Graphics.prototype);
SmartObject.prototype.constructor = SmartObject;

SmartObject.prototype.update = function() {
    //console.log("sm update");
    this.sm.update();
    this.graphics.clear();
    graphics.lineStyle(1, this.color, 1);
    graphics.drawRect(this.x, this.y, 1, 1);
};

SmartObject.prototype.addAdvertisedAction = function(action) {
    action.object = this;
    this.advertisedActions.push(action);
};

SmartObject.prototype.getAdvertisedActions = function() {
    // get all actions with cleared preconditions
    return this.advertisedActions.filter(function(action) {
        return action.canExecute();
    });
};

SmartObject.prototype.applyAction = function(action) {
    for(var effect in action.effects) {
        this.setState(effect, action.effects[effect]);
    }
}

SmartObject.prototype.setState = function(name, value) {
    this.state[name] = value;
};

SmartObject.prototype.is = function(name, value) {
    return this.state[name] == value;
};
