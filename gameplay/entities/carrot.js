//A factory for creating a certain type of vegatable or food, a carrot
//This is a strict object composition using assign and mixins.
var CarrotMaker = {
    Carrot: function(game, id, x, y) {
        var colors = ["0xE59400"];
        var rand = Math.floor(Math.random() * colors.length);
        var carrot = Object.assign(
            new GraphicsObject(game, x, y), // the base object, our graphics object
            SmartObjectMaker.SmartObject(), // a smart Object so that this object may advertise actions
            {                               // this is our state as a carrot. We could pass this in, or calculate it more
                EAT_DISTANCE: 4, //pixels
                calorie_count: 24, 
                id: id,
                color: colors[rand] //hex       
            }
        );

        //we do a post processing step to add an action to the item
        carrot.addAdvertisedAction(new EatCarrotAction(id, x, y));
        
        return carot;
    }
};