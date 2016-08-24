var SmartObject = function(parent, name) {
    this.parent = parent;
    this.name = name;
    this.advertisedActions = [];

    this.state = {};

    this.sm = new StateMachine();

    //should obejcts have states? possibly. Not quite the same as the other states, though
};

//SmartObject.prototype = {};//Object.create({});//Phaser.Graphics.prototype);
SmartObject.prototype.constructor = SmartObject;

SmartObject.prototype.update = function() {
    //this.sm.update();
    //this.graphics.clear();
    //if(this.alive) {
    //    graphics.lineStyle(1, this.color, 1);
    //    graphics.drawRect(this.x, this.y, 1, 1);
    //}
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

/*
SmartObject.prototype.applyAction = function(action) {
    for(var effect in action.effects) {
        if(typeof action.effects[effect] === 'number') {
            this.incrementState(effect, action.effects[effect]);
        } else {
            this.setState(effect, action.effects[effect]);
        }
    }
}

SmartObject.prototype.setState = function(name, value) {
    this.state[name] = value;
};


SmartObject.prototype.incrementState = function(name, value) {
    this.state[name] = this.state[name] + value;
};

SmartObject.prototype.is = function(name, value) {
    return this.state[name] == value;
};
*/