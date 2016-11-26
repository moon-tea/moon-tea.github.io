var Vector = {
    create: function (x, y) {
        return {
            x:x,
            y:y,
            plus: function(other) {
                return Vector.create(this.x + other.x, this.y + other.y);
            }
        }
    }
};
