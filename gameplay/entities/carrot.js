var CarrotMaker = {
    Carrot: function(game, id, x, y) {
        var colors = ["0xE59400"];
        var rand = Math.floor(Math.random() * colors.length);
        var carrot = Object.assign(
            new GraphicsObject(game, x, y),
            SmartObjectMaker.SmartObject(),
            {
                EAT_DISTANCE: 4, //pixels
                calorie_count: 24,
                id: id,
                color: colors[rand] 
            }
        );
        carrot.addAdvertisedAction(new EatCarrotAction(id, x, y));
        return carrot;
    }
};
