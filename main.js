/*
(function(global){
    var Extender = {
        extend: function() {
            arguments[0] = arguments[0] || {};
            for (var i = 1; i < arguments.length; i++)
            {
                for (var key in arguments[i])
                {
                    if (arguments[i].hasOwnProperty(key))
                    {
                        if (typeof(arguments[i][key]) === 'object') {
                            if (arguments[i][key] instanceof Array) {
                                arguments[0][key] = arguments[i][key];
                            } else {
                                arguments[0][key] = Extender.extend(arguments[0][key], arguments[i][key]);
                            }
                        } else {
                            arguments[0][key] = arguments[i][key];
                        }
                    }
                }
            }
            return arguments[0];
        }
    };

    Number.prototype.degsToRads = function () {
        return d3.scale.linear().domain([0, 360]).range([0, 2 * Math.PI])(this);
    };

    // Rotator Control
    var tgpAbsInd = function(options){

        // Private vars
        var self, center;

        function TgpAbsInd(options) {
            this.options = Extender.extend({}, TgpAbsInd.defaultOptions, options);
            self = this;
        }

        TgpAbsInd.defaultOptions = {
            width: 500,
            height: 500,
            innerArea: {
                areaSpeed: 0.225,
                circleRadius: 32,
                arcsCount: 3,
                arcsRadius: 12,
                arcsAngularGap: 15,
                arcsPadding: 10,
                glow: {
                    innerRadius: 38,
                    outerRadius: 62,
                    x: 7,
                    y: 7
                }
            },
            outerArcs: [

                {
                    id: "arc-1",
                    speed: -0.05,
                    radius: 11,
                    distance: 120,
                    fill: "rgba(13,215,247,.7)",
                    angularSize: 122.6,
                    startAngle: 0
                },

                {
                    id: "arc-2",
                    speed: -0.05,
                    radius: 11,
                    distance: 120,
                    fill: "rgba(13,215,247,.7)",
                    angularSize: 20,
                    startAngle: -104
                },

                {
                    id: "arc-3",
                    speed: 0.05,
                    radius: 11,
                    distance: 120,
                    fill: "rgba(13,215,247,.7)",
                    angularSize: 20,
                    startAngle: -47
                },

                {
                    id: "arc-4",
                    speed: 0.05,
                    radius: 36.6,
                    distance: 138.3,
                    fill: "rgba(13,215,247,.7)",
                    angularSize: 105,
                    startAngle: -89.2
                },

                {
                    id: "arc-5",
                    speed: 0.05,
                    radius: 36.6,
                    distance: 138.3,
                    fill: "rgba(13,215,247,.7)",
                    angularSize: 20,
                    startAngle: 133
                },

                {
                    id: "arc-6",
                    speed: -0.05,
                    radius: 36.6,
                    distance: 138.3,
                    fill: "rgba(13,215,247,.7)",
                    angularSize: 45,
                    startAngle: -94
                },

                {
                    id: "arc-7",
                    duration: 2700,
                    radius: 36.6,
                    distance: 120,
                    fill: "rgba(237,237,237,.9)",
                    angularSize: 60,
                    startAngle: 270,
                    reverse: false
                },

                {
                    id: "arc-8",
                    duration: 2700,
                    radius: 36.6,
                    distance: 120,
                    fill: "rgba(237,237,237,.8)",
                    angularSize: 80,
                    startAngle: 0,
                    reverse: true
                },

                {
                    id: "arc-9",
                    duration: 2700,
                    radius: 36.6,
                    distance: 120,
                    fill: "rgba(237,237,237,.8)",
                    angularSize: 90,
                    startAngle: 62.5,
                    reverse: false
                },

                // Tiny bright arc
                {
                    id: "arc-10",
                    duration: 2700,
                    radius: 36.6,
                    distance: 120,
                    fill: "rgba(237,237,237,.9)",
                    angularSize: 5,
                    startAngle: 200,
                    reverse: true
                }

            ]
        };

        TgpAbsInd.prototype.paintTo = function(selector){

            this.svg = d3.select(selector)
                .append("svg")
                .attr("width", this.options.width)
                .attr("height", this.options.height);

            center = {x: this.options.width / 2, y: this.options.height / 2};

            // Filters
            this.svg
                .append("defs")
                .append("filter")
                .attr("id", "inner-glow")
                .append("feGaussianBlur")
                .attr("in", "SourceGraphic")
                .attr("stdDeviation", this.options.innerArea.glow.x + " " + this.options.innerArea.glow.y);

            var g = this.svg
                .append("g");

            var innerArea = g.append("g")
                .attr("id", "inner-area");

            // Glowing arc
            innerArea.append("path")
                .attr("id", "inner-glowing-arc")
                .attr("transform", "translate(" + center.x + "," + center.y + ")")
                .attr("d", d3.svg.arc()
                        .innerRadius(this.options.innerArea.glow.innerRadius)
                        .outerRadius(this.options.innerArea.glow.outerRadius)
                        .startAngle(0)
                        .endAngle(2 * Math.PI))
                .style("fill", "rgba(13,215,247, .9)")
                .attr("filter", "url(#inner-glow)");

            // Inner circle
            innerArea.append("circle")
                .attr("id", "inner-circle")
                .attr("cx", center.x)
                .attr("cy", center.y)
                .attr("r", this.options.innerArea.circleRadius)
                .style("fill", "rgb(237,237,237)");

            innerArea.append("use")
                .attr("xlink:href", "#inner-circle")
                .attr("filter", "url(#inner-glow)");

            var paddings = this.options.innerArea.arcsCount * self.options.innerArea.arcsAngularGap,
                arcAngularSize = (360 - paddings) / this.options.innerArea.arcsCount;

            // Inner surrounding arcs
            var innerArcs = innerArea.append("g");

            innerArcs.selectAll("path")
                .data(d3.range(this.options.innerArea.arcsCount + 1))
            .enter()
                .append("path")
                .style("fill", "rgb(13,215,247)")
                .attr("transform", "translate(" + center.x + "," + center.y + ")" +
                      "rotate(" + (180 - self.options.innerArea.arcsAngularGap / 2) + ")")
                .attr("d", function(d, i){

                    var _innerRadius = self.options.innerArea.circleRadius + self.options.innerArea.arcsPadding,
                        startAngle = (arcAngularSize * i + self.options.innerArea.arcsAngularGap * (i + 1)).degsToRads(),
                        endAngle = arcAngularSize.degsToRads() + startAngle;

                    return d3.svg.arc()
                        .innerRadius(_innerRadius)
                        .outerRadius(_innerRadius + self.options.innerArea.arcsRadius)
                        .startAngle(startAngle)
                        .endAngle(endAngle)();
                });

            // Outer Arcs
            var outerArea = g.append("g")
                .attr("id", "outer-area");

            var outerArcs = outerArea.selectAll("path")
                .data(this.options.outerArcs)
            .enter()
                .append("path")
                .attr("id", function(d){return d.id;})
                .style("fill", function(d){return d.fill;})
                .attr("transform", "translate(" + center.x + "," + center.y + ")")
                .attr("d", function(d){

                    var _startAngle = d.startAngle.degsToRads(),
                        _angularSize = d.angularSize.degsToRads(),
                        _innerRadius = d.distance;

                    return d3.svg.arc()
                        .innerRadius(_innerRadius)
                        .outerRadius(_innerRadius + d.radius)
                        .startAngle(_startAngle)
                        .endAngle(_startAngle + _angularSize)();
                });

            var t0 = Date.now(),
                noReverseArcs = outerArcs.filter(function(d){ return !('reverse' in d) }),
                t = "translate(" + center.x + "," + center.y + ") ";

            function reverseArcTransition(arc, rev){

                arc.transition()
                    .duration(function(d){ return d.duration })
                    .ease('linear')
                    .attrTween("transform", function(d) {
                         return (rev ? d3.interpolate(t + "rotate(" + (d.reverse ? 360 : -360) + ")", t + "rotate(0)")
                            : d3.interpolate(t + "rotate(0)", t + "rotate(" + (d.reverse ? 360 : -360) + ")"));
                    })
                    .each("end", function() {
                        d3.select(this).call(reverseArcTransition, !rev);
                    });
            }

            outerArcs.filter(function(d){ return ('reverse' in d) }).call(reverseArcTransition, false);

            d3.timer(function(){

                var delta = Date.now() - t0;

                innerArcs.attr("transform", function() {
                    return "rotate(" + delta * self.options.innerArea.areaSpeed +
                           "," + center.x + "," + center.y + ")";
                });

                noReverseArcs.attr("transform", function(d) {
                    return "translate(" + center.x + "," + center.y + ") rotate(" + delta * d.speed + ")";
                });

            });

            return this;
        };

        return new TgpAbsInd(options);
    };

    global.tgpAbsInd = tgpAbsInd;

    tgpAbsInd({}).paintTo("#holder");

})
*/

//(window);

Number.prototype.degsToRads = function () {
    return d3.scale.linear().domain([0, 360]).range([0, 2 * Math.PI])(this);
};

function randomInRange(min, max) {
    return d3.scale.linear().domain([0, 1]).range([min, max])(Math.random());
}

function randomDataset(min, max) {
    var amount;
    var data = [];

    if (min === undefined) {
        return [];
    }
    
    if (max !== undefined) {
        amount = d3.scale.linear().domain([0,1]).range([min, max])(Math.random());
    } else {
        amount = min;
    }
    for (var i=0; i<amount; i++) {
        data.push(i);
    }
    return data;
}

function shapeCreator(options) {

    var radius = options["radius"];
    var distance = options["distance"];
    var rotation = options["rotation"] || randomInRange(0,360);
    var angularSize = options["angularSize"] || randomInRange(0, 360);
    var startAngle = options["startAngle"] || randomInRange(0, 360);
    var outerRadius = options["outerRadius"];
    var innerRadius = options["innerRadius"];
    var dataset = options["dataset"];

    var inputData = {}
    inputData["radius"] = (radius && radius.length === 2 ? randomInRange(radius[0], radius[1]) : radius);
    inputData["distance"] = (distance && distance.length === 2 ? randomInRange(distance[0], distance[1]) : distance);
    inputData["rotation"] = (rotation && rotation.length === 2 ? randomInRange(rotation[0], rotation[1]) : rotation);
    inputData["angularSize"] = (angularSize && angularSize.length === 2 ? randomInRange(angularSize[0], angularSize[1]) : angularSize);
    inputData["startAngle"] = (startAngle && startAngle.length === 2 ? randomInRange(startAngle[0], startAngle[1]) : startAngle);
    inputData["outerRadius"] = (outerRadius && outerRadius.length === 2 ? randomInRange(outerRadius[0], outerRadius[1]) : outerRadius);
    inputData["innerRadius"] = (innerRadius && innerRadius.length === 2 ? randomInRange(innerRadius[0], innerRadius[1]) : innerRadius);
    if (dataset) {
        if (dataset["random"] === true) {
            var amount = dataset["amount"];
            inputData["dataset"] = (amount && amount.length === 2 ? randomDataset(amount[0], amount[1]) : randomDataset(amount));
        } else {
            inputData["dataset"] = dataset["data"];
        }
    }

    inputData["id"] = "arc-1";
    inputData["speed"] = 0.05;
    inputData["fill"] = "rgba(13,215,247,.7)";


    var resultData = {}
    for (var i in inputData) {
        if (inputData.hasOwnProperty(i)) {
            if (inputData[i]) { resultData[i] = inputData[i]}
        }
    }
    /* {
        id: "arc-1",
        speed: -0.05,
        radius: 15,
        distance: 120,
        fill: "rgba(13,215,247,.7)",
        angularSize: 250.6,
        startAngle: 0
    } */
    return resultData
}

function executeFunctionNTimes(fn, fnData, n) {
    // executes fn with fnData n times, return the results in an array
    var results = [];
    for (var i = 0; i < n; i++) {
        results.push(fn(fnData));
    }
    return results;
}

var createSVG = function (width, height, selector) {
    /* Creates an SVG under the selected element */
    var svg = d3.select(selector)
                .append("svg")
                .attr("width", width)
                .attr("height", height);
    return svg;
}

var createCircle = function (svg, circleData) {
    /* creates circle(s) using the circleData under the svg */
    this.options = {
        "width":parseInt(svg.attr("width")),
        "height":parseInt(svg.attr("height")),
        "circleData":{"radius":50}
    }

    var center = {
        "x":this.options.width / 2,
        "y":this.options.height / 2
    }

    var innerArea = svg.append("g")
        .attr("id", "inner-area");

    // Inner circle
    innerArea.append("circle")
        .attr("id", "inner-circle")
        .attr("cx", center.x)
        .attr("cy", center.y)
        .attr("r", this.options.circleData.radius)
        .style("fill", "rgb(237,237,237)");
}

var createArc =  function (svg, arcData) {
    /* creates arc(s) using the arcData under the svg */
    this.options = {
        "width":parseInt(svg.attr("width")),
        "height":parseInt(svg.attr("height")),
        "outerArcs":arcData
    }

    var center = {
        "x":this.options.width / 2,
        "y":this.options.height / 2
    }

    var outerArea = svg.append("g")
        .attr("id", "outer-area");

    var outerArcs = outerArea.selectAll("path")
        .data(this.options.outerArcs)
        .enter()
        .append("path")
        .attr("id", function(d){return d.id;})
        .style("fill", function(d){return d.fill;})
        .attr("transform", "translate(" + center.x + "," + center.y + ")")
        .attr("d", function(d){

            var _startAngle = d.startAngle.degsToRads(),
                _angularSize = d.angularSize.degsToRads(),
                _innerRadius = d.distance;

            return d3.svg.arc()
                .innerRadius(_innerRadius)
                .outerRadius(_innerRadius + d.radius)
                .startAngle(_startAngle)
                .endAngle(_startAngle + _angularSize)();
        });
    }

//var svg = createSVG(1000, 1000, "#holder");

/*


*/

/*
<5,2704659
5-13,4499890
14-17,2159981
18-24,3853788
25-44,14106543
45-64,8819342
≥65,612463
*/



var createDonut = function(svg, donutData) {
    /* creates donuts using the donutData under the svg */

    var color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    this.options = {
        "width":parseInt(svg.attr("width")),
        "height":parseInt(svg.attr("height")),
        "donutData":donutData
    }

    var center = {
        "x":this.options.width / 2,
        "y":this.options.height / 2
    }

    var donutArea = svg.append("g")
        .attr("id", "donut-area");

    var arc = d3.svg.arc()
        .outerRadius(this.options["donutData"]["radius"] - this.options["donutData"]["outerRadius"])
        .innerRadius(this.options["donutData"]["radius"] - this.options["donutData"]["innerRadius"]);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d; });

    var g = donutArea.selectAll(".arc")
        .data(pie(this.options["donutData"]["dataset"]))
        .enter().append("g")
        .attr("class", "arc")
        .attr("transform", "rotate(" + this.options["donutData"]["rotation"] + ")")
        .attr("transform", "translate(" + center.x + "," + center.y + ")");
 
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data); });
};

//var svg = createSVG(500, 500, "#holder");
var svg_02 = createSVG(1000, 1000, "#holder-2");
var donutData = {
    radius:[100,250],
    outerRadius:[5,7],
    innerRadius:[7,12],
    dataset:{"random":true,
             "amount":[3,50],
            }
    };

/*
var donutDataArray = executeFunctionNTimes(shapeCreator, donutData, 15);
console.log(donutDataArray)
donutDataArray.map(function(data) {
    createDonut(svg, data);
})
*/

var arcData = {
    radius:[2, 4], 
    distance:[20,300], 
    angularSize:[0, 270], 
    startAngle:[0,360]
};
var circleData = {radius:[10,20]};

var arcDataArray = executeFunctionNTimes(shapeCreator, arcData, 100);
var circleDataArray = executeFunctionNTimes(shapeCreator, circleData, 60)

//createCircle(svg_02, circleDataArray);
createArc(svg_02, arcDataArray);




            /*
            var paddings = this.options.innerArea.arcsCount * self.options.innerArea.arcsAngularGap,
                arcAngularSize = (360 - paddings) / this.options.innerArea.arcsCount;

            // Inner surrounding arcs
            var innerArcs = innerArea.append("g");

            innerArcs.selectAll("path")
                .data(d3.range(this.options.innerArea.arcsCount + 1))
            .enter()
                .append("path")
                .style("fill", "rgb(13,215,247)")
                .attr("transform", "translate(" + center.x + "," + center.y + ")" +
                      "rotate(" + (180 - self.options.innerArea.arcsAngularGap / 2) + ")")
                .attr("d", function(d, i){

                    var _innerRadius = self.options.innerArea.circleRadius + self.options.innerArea.arcsPadding,
                        startAngle = (arcAngularSize * i + self.options.innerArea.arcsAngularGap * (i + 1)).degsToRads(),
                        endAngle = arcAngularSize.degsToRads() + startAngle;

                    return d3.svg.arc()
                        .innerRadius(_innerRadius)
                        .outerRadius(_innerRadius + self.options.innerArea.arcsRadius)
                        .startAngle(startAngle)
                        .endAngle(endAngle)();
                });

            var t0 = Date.now(),
                noReverseArcs = outerArcs.filter(function(d){ return !('reverse' in d) }),
                t = "translate(" + center.x + "," + center.y + ") ";

            function reverseArcTransition(arc, rev){

                arc.transition()
                    .duration(function(d){ return d.duration })
                    .ease('linear')
                    .attrTween("transform", function(d) {
                         return (rev ? d3.interpolate(t + "rotate(" + (d.reverse ? 360 : -360) + ")", t + "rotate(0)")
                            : d3.interpolate(t + "rotate(0)", t + "rotate(" + (d.reverse ? 360 : -360) + ")"));
                    })
                    .each("end", function() {
                        d3.select(this).call(reverseArcTransition, !rev);
                    });
            }

            outerArcs.filter(function(d){ return ('reverse' in d) }).call(reverseArcTransition, false);

            d3.timer(function(){

                var delta = Date.now() - t0;

                innerArcs.attr("transform", function() {
                    return "rotate(" + delta * self.options.innerArea.areaSpeed +
                           "," + center.x + "," + center.y + ")";
                });

                noReverseArcs.attr("transform", function(d) {
                    return "translate(" + center.x + "," + center.y + ") rotate(" + delta * d.speed + ")";
                });

            });

            return this;
        };

        return new TgpAbsInd(options);
        */

