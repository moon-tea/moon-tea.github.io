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

//we put this here to eventually update agent specific stuff, 
//and so that the children of Agent can call this
Agent.prototype.update = function() {
    SmartObject.prototype.update.call(this);
};

Agent.prototype.addAction = function(action) {
    action.agents.push(this);
    this.actions.push(action);
};

Agent.prototype.removeAction = function(action) {
    this.actions.splice( this.actions.map( function(e) { return e.name; } ).indexOf(action.name), 1 );
};

// get all actions with cleared preconditions
Agent.prototype.getUsableActions = function() {
    return this.actions.filter(function(action) {
        return action.canExecute();
    });
};
