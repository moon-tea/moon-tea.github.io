//This is a factory for making smartObjects
//Smart Objects just have a number of actions called AdvertisedActions that they can cast to others
//These advertised actions will be given to Agents and if the Agent can perform the action, they might plan to
var SmartObjectMaker = {
    //"constructor"
    SmartObject: function() {
        //returns a pojo
        return {
            //parent: parent,
            name: name,
            advertisedActions: [],

            state: {},

            //should smart obejcts have state?
            //the answer is yes, but right now they are not implemented
            //example, maybe a vegatable has a state of "growing", "ripe", "rotting", "rotten".
            sm: new StateMachine(),
            
            addAdvertisedAction: function(action) {
                action.object = this;
                this.advertisedActions.push(action);
            },   

            getAdvertisedActions: function() {
                // get all actions with cleared preconditions
                return this.advertisedActions.filter(function(action) {
                    return action.canExecute();
                });
            }
        }
    }
};

/*
SmartObject.prototype.update = function() {
    //this.sm.update();
};

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
