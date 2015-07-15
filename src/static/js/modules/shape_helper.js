export function ShapeHelper() {
    //
}

ShapeHelper._randomInRange = function (min, max) {
    return d3.scale.linear().domain([0, 1]).range([min, max])(Math.random());
};


ShapeHelper.randomizeData = function(sourceData, randomizationData) {
    /**
    * randomizeData randomizes the corresponding items in sourceData,
    * according to data from randomization data, returns a copy of the original sourceData
    */

    // create a copy of the target data to leave the original intact
    var copyData = {};
    for (var attr in sourceData) {
        if (sourceData.hasOwnProperty(attr)) {
            copyData[attr] = sourceData[attr];
        }
    }

    var changed = false;
    for (var rAttr in randomizationData) {
        if (copyData.hasOwnProperty(rAttr)) {
            var range = randomizationData[rAttr];
            if (range instanceof Array && range.length >= 2) {
                changed = true;
                var randomNumber = this._randomInRange(range[0], range[1]);
                copyData[rAttr] = randomNumber
            }
        }
    }

    if (!changed) { // if no change performed just return the original, no need to risk it
        return sourceData
    } else {
        return copyData;
    }
}

ShapeHelper.executeFunctionNTimes = function(data) {
    /*
    * executes fn with fnData n times, return the results in an array
    */
    var fn = data["fn"];
    var fnData = data["fnData"];
    var n = data["n"];

    var results = [];
    for (var i = 0; i < n; i++) {
        results.push(fn.apply(this, fnData));
    }
    return results;
}