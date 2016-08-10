var Planner = function() {

};

Planner.prototype.plan = function(agent, goal) {
    console.log(agent.state);
    var root = new Node(null, null, 0, agent.state);

    var leaves = [];

    var found = this._buildGraph(root, leaves, agent.actions, goal, 0);

    var cheapest = leaves.sort(function(a, b) {
        return a.cost < b.cost;
    })[0];

    var plan = [];

    var node = cheapest;

    while(node) {
        if(node.action) {
            plan.unshift(node.action);
        }

        node = node.parent;
    }

    console.log(plan);

    return plan;
};

Planner.prototype._buildGraph = function(parent, leaves, actions, goal, depth) {
    var foundOne = false;

    var that = this;
    depth++;
    if(depth>10) {
        return false;
    }
    actions.forEach(function(action) {
        if(that._inState(parent.state, action.preconditions)) {
            console.log(parent.state);
            var currentState = that._applyState(parent.state, action.effects);
            var p = new Node(parent, action, parent.cost + action.cost, currentState);
            var cstate = {};
            cstate[goal.name] = currentState[goal.name].value; 
            p.state = currentState;
            console.log(p);
            var node = new Node(p, action, p.cost + action.cost, currentState);
            
            var goalReached = false;
            if(currentState[goal.name].type == "incremental") {
                console.log(currentState[goal.name].value, goal.value);
                goalReached = currentState[goal.name].value > goal.value;
            } else {
                goalReached = currentState[goal.name] == goal.value;
            }

            if(goalReached) {
                leaves.push(node);
                foundOne = true;
            } else {
                var index = actions.indexOf(action);

                var subset = null;
                var found = false;
                if(currentState[goal.name].type == "incremental") {
                    leaves.push(node);
                    var subset = actions;
                } else {
                    var subset = actions.slice(0, index).concat(actions.slice(index + 1, actions.length));
                }   

                var found = that._buildGraph(node, leaves, subset, goal, depth);

                if(found) {
                    foundOne = true;
                }
            }
        }
    });

    return foundOne;
};

Planner.prototype._inState = function(state, preconditions) {
    var clear = true;
    for(var cond in preconditions) {
        clear = clear && (state[cond] == preconditions[cond]);
    }

    return clear;
};

Planner.prototype._applyState = function(old, newState) {
    var result = [];

    for(var val in old) {
        result[val] = old[val];
    }

    for(var effect in newState) {
        console.log(newState[effect].type);
        if(effect.type == "incremental") {
            result[effect] += newState[effect].value;
        } else {
            result[effect] = newState[effect];
        }
    }

    return result;
};
