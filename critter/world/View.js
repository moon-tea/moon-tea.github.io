var View = {
    create: function(world, vector) {
        //private
        var world = world;
        var vector = vector;
        return {
            look: function(dir) {
                var target = vector.plus(directions[dir]);
                if (world.grid.isInside(target)) {
                    return world.grid.get(target);
                } else {
                    return "#";
                }
            },
            findAll: function(props) {
                var found = [];
                for (var dir in directions)
                    if (this.look(dir) && this.look(dir).type == props.type) {
                        found.push(dir);
                    }
                return found;
            },
            find: function(props) {
                var found = this.findAll(props);
                if (found.length == 0) return null;
                return randomElement(found);
            }
        }
    }
};
