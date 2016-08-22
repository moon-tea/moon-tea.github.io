var Agent = function(actor, name) {
    //SmartObject.call(this, name);
    this.actor = actor;
    this.name = name;
    this.actions = [];
    this.currentActions = [];

    this.state = {};
    this.sm = new StateMachine();

    //this.sm.add("idle", new IdleState(this));
    //this.sm.add("moving", new MovingState(this));
    //this.sm.add("action", new ActionState(this));
    this.sm.add("idle", new IdleState(this.actor));
    this.sm.add("moving", new MovingState(this.actor));
    this.sm.add("action", new ActionState(this.actor));

    this.sm.enter("idle");
};

//Agent.prototype = Object.create(SmartObject.prototype);
Agent.prototype.constructor = Agent;

//we put this here to eventually update agent specific stuff, 
//and so that the children of Agent can call this
//Agent.prototype.update = function() {
Agent.prototype.update = function() {
    this.sm.update();
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

Agent.prototype.applyAction = function(action) {
    for(var effect in action.effects) {
        if(typeof action.effects[effect] === 'number') {
            this.incrementState(effect, action.effects[effect]);
        } else {
            this.setState(effect, action.effects[effect]);
        }
    }
}

Agent.prototype.setState = function(name, value) {
    this.state[name] = value;
};


Agent.prototype.incrementState = function(name, value) {
    this.state[name] = this.state[name] + value;
};

Agent.prototype.is = function(name, value) {
    return this.state[name] == value;
};

