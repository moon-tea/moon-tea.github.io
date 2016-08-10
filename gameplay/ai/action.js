var Action = function(name, cost) {
    this.name = name;
    this.agent = undefined;
    this.effects = {};
    this.preconditions = {};

    this.cost = cost;
};

Action.prototype.addEffect = function(name, value) {
    this.effects[name] = value;
};

/*
Action.prototype.addIncrementalEffect = function(name, obj) {
    //if initialized
    if(this.effects[name]) {
    	this.effects[name] += obj.value;	
	} else {
		this.effects[name] = 0;
	}
};
*/

Action.prototype.addPrecondition = function(name, value) {
    this.preconditions[name] = value;
};

Action.prototype.execute = function() {
    console.warn(this.name + ": You might want to override execute for me :P");
};

Action.prototype.canExecute = function() {
    return true;
}
