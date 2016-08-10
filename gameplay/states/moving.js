var MovingState = function(entity) {
    this._entity = entity;
};

MovingState.prototype.enter = function() {
    console.log(this._entity.name + " enters Moveing state");

    this._entity._target = this._entity._current_plan[0]._position;
    this._entity.body.moves = true;
};

MovingState.prototype.leave = function() {
    console.log(this._entity.name + " leaves Moveing state");
};

MovingState.prototype.update = function() {
    console.log("moving");
    if(this._entity._target) {
        console.log("moving2");
        var t =  this._entity._target;
        this._entity._game.physics.arcade.moveToXY(this._entity, t.x, t.y, 100);

        var p = {
            x:this._entity.x,
            y:this._entity.y
        };

        var dist = Phaser.Math.distance(p.x, p.y, t.x, t.y);

        if(dist <= 10) {
            this._entity.body.moves = false;
            this._entity._target = null;
            this._entity.sm.enter("action");
        }
    }
};
