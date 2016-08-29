var AgentMaker = {
    Agent: function(name) {
        var obj = {
            name: name,
            actions: [],
            currentActions: [],

            state: {},
            sm: new StateMachine(),
            
            updateStateMachine: function() {
                //console.log(this.sm)
                this.sm.update();
            },

            addAction: function(action) {
                action.agents.push(this);
                this.actions.push(action);
            },

            removeAction: function(action) {
                this.actions.splice( this.actions.map( function(e) { return e.name; } ).indexOf(action.name), 1 );
            },

            // get all actions with cleared preconditions
            getUsableActions: function() {
                return this.actions.filter( function(a) {
                    return a.canExecute();
                });
            },

            applyAction: function(action) {
                for(var effect in action.effects) {
                    if (typeof action.effects[effect] === 'number') {
                        this.incrementState(effect, action.effects[effect]);
                        console.log(this);
                    } else {
                        this.setState(effect, action.effects[effect]);
                    }
                }
            },

            setState: function(name, value) {
                this.state[name] = value;
            },

            incrementState: function(name, value) {
                this.state[name] = this.state[name] + value;
            },

            is: function(name, value) {
                return this.state[name] == value;
            }
        };

        //obj.sm.add("idle", new IdleState(obj));
        //obj.sm.add("moving", new MovingState(obj));
        //obj.sm.add("action", new ActionState(obj));

        //obj.sm.enter("idle");
        return obj;
    }
};

//Agent.prototype = Object.create(SmartObject.prototype);
//Agent.prototype.constructor = Agent;

//we put this here to eventually update agent specific stuff, 
//and so that the children of Agent can call this
//Agent.prototype.update = function() {

