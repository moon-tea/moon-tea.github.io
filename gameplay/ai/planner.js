var Planner = function() {

};

Planner.prototype.plan = function(agent, goal) {
    //console.log(agent);
    var root = new Node(null, null, 0, agent.state);

    var leaves = [];

    var found = this._buildGraph(root, leaves, agent, agent.actions, goal);
    //console.log(leaves);
    var sortedLeaves = leaves.sort(function(a, b) {
        if (a.cost < b.cost) {
            return -1;
        }
        if (a.cost > b.cost) {
            return 1;
        }
        return 0;
    });
    //console.log(sortedLeaves);
    var cheapest = sortedLeaves[0];
    //console.log(cheapest);

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

Planner.prototype._buildGraph = function(parent, leaves, agent, actions, goal, depth) {
    depth = (typeof depth !== 'undefined') ? depth : -1;  
    var foundOne = false;
    var that = this;
    depth++;
    actions.forEach(function(action) {
        if(that._inState(parent.state, action.preconditions)) {
            var currentState;
            if(depth < 1) {
                currentState = that._applyState(parent.state, action.effects);
            } else {
                currentState = that._iterateState(parent.state, action.effects);
            }

            //do a calculation to figure out the cost.
            var baseCost = parent.cost + action.cost; //time itll take do it
            if(parent.action){
                //console.log(agent, parent.action, action);
                //console.log()
            }
            var distCost = Phaser.Math.distance(agent.x, agent.y, action._position.x, action._position.y);;
            var cost = baseCost + distCost;
            //console.log(cost);
            var node = new Node(parent, action, cost, currentState);

            for (var name in goal) {
                if(currentState[name] == goal[name].value || ( typeof currentState[name] === 'number' && currentState[name] >= goal[name])) {
                    leaves.push(node);
                    foundOne = true;
                } else {
                    var index = actions.indexOf(action);

                    var subset = actions.slice(0, index).concat(actions.slice(index + 1, actions.length));
                    //var subset = actions;//.slice(0, index).concat(actions.slice(index + 1, actions.length));
                    if(depth < 2) {
                        var found = that._buildGraph(node, leaves, agent, subset, goal, depth);
                    }

                    if(found) {
                        foundOne = true;
                    }
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
