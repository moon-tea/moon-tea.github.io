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
    if(this._entity._target) {
        var entity = this._entity; 
        var t = entity._target;
        var p = {
            x: entity.x,
            y: entity.y
        };

//        entity._game.physics.arcade.moveToXY(entity, t.x, t.y, 100);

        //Agent.prototype.update();
    //console.log(entity);
    //console.log(Agent.prototype.update);
    //Agent.prototype.update.call(this);
    //console.log(this);

    // Calculate the angle from the rabbit to the target coordinates you need.
    var targetAngle = entity._game.math.angleBetween(
        p.x, p.y,
        t.x, t.y
    );

    // Add our "wobble" factor to the targetAngle to make the rabbit wobble
    // Remember that this.wobble is tweening (above)
    targetAngle += entity._game.math.degToRad(entity.wobble);

    // Make each rabbit steer away from other rabbits.
    // Each rabbit knows the group that it belongs to (rabbitGroup).
    // It can calculate its distance from all other rabbits in the group and
    // steer away from any that are too close. This avoidance behavior prevents
    // all of the rabbits from bunching up too tightly and following the
    // same track.
    
    var avoidAngle = 0;
    
    entity.parent.forEachAlive(function(m) {
        // Don't calculate anything if the other rabbit is me
        if (entity == m) return;

        // Already found an avoidAngle so skip the rest
        if (avoidAngle !== 0) return;

        // Calculate the distance between me and the other rabbit
        var distance = entity._game.math.distance(p.x, p.y, m.x, m.y);

        // If the rabbit is too close...
        if (distance < entity.AVOID_DISTANCE) {
            // Chose an avoidance angle of 90 or -90 (in radians)
            avoidAngle = Math.PI/2; // zig
            //if (entity._game.math.chanceRoll(50)) avoidAngle *= -1; // zag
            if (Phaser.Utils.chanceRoll(50)) avoidAngle *= -1; // zag
        }
    }, entity);
    
    // Add the avoidance angle to steer clear of other rabbits
    targetAngle += avoidAngle;

    // Gradually (this.TURN_RATE) aim the rabbit towards the target angle
    if (entity.rotation !== targetAngle) {
        // Calculate difference between the current angle and targetAngle
        var delta = targetAngle - entity.rotation;

        // Keep it in range from -180 to 180 to make the most efficient turns.
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        if (delta > 0) {
            // Turn clockwise
            entity.angle += entity.TURN_RATE;
        } else {
            // Turn counter-clockwise
            entity.angle -= entity.TURN_RATE;
        }

        // Just set angle to target angle if they are close
        if (Math.abs(delta) < entity._game.math.degToRad(entity.TURN_RATE)) {
            entity.rotation = targetAngle;
        }
    }

    // Calculate velocity vector based on entity.rotation and entity.SPEED
    entity.body.velocity.x = Math.cos(entity.rotation) * entity.speed;
    entity.body.velocity.y = Math.sin(entity.rotation) * entity.speed;

        var dist = Phaser.Math.distance(p.x, p.y, t.x, t.y);

        if(dist <= 4) {
            entity.body.moves = false;
            entity._target = null;
            entity.agent.sm.enter("action");
        }
    }
};
