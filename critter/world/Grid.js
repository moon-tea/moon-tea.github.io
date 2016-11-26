var Grid = {
    create: function(w, h) {
        //private
        var width = w;
        var height = h;
        var space = [width*height];
        
        return {
            //space: [width*height],
            //width: width,
            //height: height,
            getWidth: function() {
                return width;
            },
            getHeight: function () {
                return height;
            },
            isInside: function(vector) {
                return vector.x >= 0 && vector.x < width && vector.y >= 0 && vector.y < height;
            },
            get: function(vector) {
                return space[vector.x + width * vector.y];
            },
            set: function(vector, value) {
                space[vector.x + width * vector.y] = value;
            },
            forEach: function(f, context) {
                for (var y = 0; y < height; y++) {
                    for (var x = 0; x < width; x++) {
                        var value = space[x + y * width];
                        if (value != null) {
                            f.call(context, value, Vector.create(x, y));
                        }
                    }
                }
            }
        }
    }
};
