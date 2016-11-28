var Empty = {
    bgColors:["#a1a063","#b9bc6b","#b1ba7a","#a3ad61","#a5aa74"],
    create: function() {
	    var bgc = randomElement(Empty.bgColors);
        return {
            type: "empty",
            walkable: true,
            backgroundColor: bgc
        }
    }
};
