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
                for (var dir in directions) {
                    var checkAllProps = true;
                    for(var key in props) {
                        if(key == "walkable") {
                            //console.log("key is walkable", this.look(dir), this.look(dir)[key],props[key]);
                        }
                        //if (this.look(dir) && this.look(dir)[key] == props[key]) {
                        checkAllProps = checkAllProps && (this.look(dir) && this.look(dir)[key] == props[key]);
                    }
                    if(checkAllProps) {
                        //console.log(props, "found")
                        found.push(dir);
                    }
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
