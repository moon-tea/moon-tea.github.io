var Agent = function(name) {
    SmartObject.call(this, name);
    this.actions = [];
    this.currentActions = [];

    this.sm.add("idle", new IdleState(this));
    this.sm.add("moving", new MovingState(this));
    this.sm.add("action", new ActionState(this));

    this.sm.enter("idle");
};

Agent.prototype = Object.create(SmartObject.prototype);
Agent.prototype.constructor = Agent;

Agent.prototype.update = function() {
    //console.log("agent update");
    SmartObject.prototype.update.call(this);
};

//Agent.prototype.applyAction = function(action) {
//    SmartObject.prototype.applyAction.call(this, action);
//}
//
//Agent.prototype.setState = function(name, value) {
//    SmartObject.prototype.applyAction.call(this, action);
//};
//
//Agent.prototype.is = function(name, value) {
//    SmartObject.prototype.applyAction.call(this, action);
//};

Agent.prototype.addAction = function(action) {
    action.agent = this;
    this.actions.push(action);
};

Agent.prototype.removeAction = function(action) {
    //map returns an array of strings ["name1", "name2", "...", "nameN"]
    //this could be a slow operation that takes O(n) and makes another array in memory
    this.actions.splice( this.actions.map( function(e) { return e.name; } ).indexOf(action.name), 1 );
};

Agent.prototype.getUsableActions = function() {
    // get all actions with cleared preconditions
    return this.actions.filter(function(action) {
        return action.canExecute();
    });
};

/*
Agent.prototype.applyAction = function(action) {
    for(var effect in action.effects) {
        this.setState(effect, action.effects[effect]);
    }
}

Agent.prototype.setState = function(name, value) {
    this.state[name] = value;
};

Agent.prototype.is = function(name, value) {
    return this.state[name] == value;
};
*/
