var Planner = function() {

};

Planner.prototype.plan = function(agent, goal) {
    var root = new Node(null, null, 0, agent.state);

    var leaves = [];

    var found = this._buildGraph(root, leaves, agent.actions, goal);

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

    return plan;
};

Planner.prototype._buildGraph = function(parent, leaves, actions, goal, depth) {
    depth = (typeof depth !== 'undefined') ? depth : -1;  
    var foundOne = false;

    var that = this;
    depth++;
    if(depth > 9) { return false; }
    actions.forEach(function(action) {
        if(that._inState(parent.state, action.preconditions)) {
            var currentState;
            if(depth < 1) {
                currentState = that._applyState(parent.state, action.effects);
            } else {
                currentState = that._iterateState(parent.state, action.effects);
            }

            var node = new Node(parent, action, parent.cost + action.cost, currentState);

            if(currentState[goal.name] == goal.value || ( typeof currentState[goal.name] === 'number' && currentState[goal.name] > goal.value)) {
                leaves.push(node);
                foundOne = true;
            } else {
                var index = actions.indexOf(action);

                var subset = actions.slice(0, index).concat(actions.slice(index + 1, actions.length));
                //var subset = actions;//.slice(0, index).concat(actions.slice(index + 1, actions.length));

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
        result[effect] = newState[effect];
    }

    return result;
};


Planner.prototype._iterateState = function(old, newState) {
    var result = [];

    for(var val in old) {
        result[val] = old[val];
    }

    for(var effect in newState) {
        //console.log("iterate", result[effect], newState[effect] );
        if(typeof newState[effect] === 'number') {
           result[effect] += newState[effect];
        } else {
           result[effect] = newState[effect];
        }
    }

    return result;
};
