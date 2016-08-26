//A factory for creating a certain type of den
//This is a strict object composition using assign and mixins.
var DenMaker = {
    Den: function(game, id, x, y) {
        var colors = ["0x26190f"];
        var rand = Math.floor(Math.random() * colors.length);
        var den = Object.assign(
            new GraphicsObject(game, x, y), // the base object, our graphics object
            SmartObjectMaker.SmartObject(), // a smart Object so that this object may advertise actions
            {                               // this is our state as a carrot. We could pass this in, or calculate it more
                SAFE_DISTANCE: 4, //pixels
                energy_count: 100, 
                id: id,
                color: colors[rand] //hex       
            }
        );

        //we do a post processing step to add an action to the item
        den.addAdvertisedAction(new SleepAction(id, x, y));
        return den;
    }
};
