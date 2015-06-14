/** @jsx React.DOM */

Number.prototype.degsToRads = function () {
    return d3.scale.linear().domain([0, 360]).range([0, 2 * Math.PI])(this);
};

/* PIE */

var Pie = function(data) {
    this.radius = data.radius;
    this.innerRadius = data.innerRadius;
    this.width = data.width;
    this.height = data.height;
    this.center = {
        "x":this.width / 2,
        "y":this.height / 2     
    }
    this.chartClass = data.chartClass; 
}

Pie.prototype.createShapeBase = function(baseSelector) {
    var width = this.width;
    var height = this.height;
    var chartClass = this.chartClass;

    var svg = d3.select(baseSelector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", chartClass)

    return svg;
}

Pie.prototype.drawShape = function(base, data) {
    var width = this.width;
    var height = this.height;
    var center = this.center;
    var radius = this.radius;
    var innerRadius = this.innerRadius;

    var pie = d3.layout.pie()
        .sort(null)
        .value(
            function(d) { return d.width; }
        );

    var arc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(function (d) {
        return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius; 
      });

    var g = base.append("g");
    var shape = g.selectAll("path")
        .data(pie(data))
        .enter().append("path")
        .style("fill", function(d, i){
            return d.data.color;
        })
        .attr("transform", "translate(" + center.x + "," + center.y + ")")
        .attr("d", arc);

    /*
    var t0 = Date.now();

    d3.timer(function(){
        var delta = Date.now() - t0;
        arc.outerRadius(function (d) {
            //console.log(d.data.score);
            //console.log(delta);
            return ((radius - innerRadius) * ((d.data.score + d3.scale.linear().domain([0,1]).range([-10, 10])(Math.random()) ) / 100.0) + innerRadius); 
          });
    });
    */

    return shape;
}

Pie.prototype.createAndDrawShape = function (baseSelector, data) {
    var shape, base;
    base = this.createShapeBase(baseSelector);
    shape = this.drawShape(base, data);
}

/* PIE END */

/* BUBBLES */

var Bubbles = function(data) {
    this.padding = data.padding;
    this.diameter = data.diameter;
    this.color = data.color;
    this.format = data.format;
    this.chartClass = data.chartClass; 
}

Bubbles.prototype.flattenData = function (data) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, data);
  return {children: classes};
}

Bubbles.prototype.createShapeBase = function(baseSelector) {
    var width = this.diameter;
    var height = this.diameter;
    var chartClass = this.chartClass;

    var svg = d3.select(baseSelector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", chartClass)

    return svg;
}

Bubbles.prototype.drawShape = function(base, data) {
    var diameter = this.diameter;
    var padding = this.padding;
    var self = this;

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(padding);

    var g = base.append("g");

    var shape = g.selectAll(".node")
        .data(bubble.nodes(this.flattenData(data))
        .filter(function(d) { return !d.children; }))
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    
    shape.append("title")
        .text(function(d) { return d.className + ": " + self.format(d.value); });

    shape.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return self.color(d.packageName); });

    shape.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className.substring(0, d.r / 3); });

    return shape;
}

Bubbles.prototype.createAndDrawShape = function (baseSelector, data) {
    var shape, base;
    base = this.createShapeBase(baseSelector);
    shape = this.drawShape(base, data);
}

/* BUBBLES END */

/* ARC */ 

var Arc = function(data) {
    this.width = data.width;
    this.height = data.height;
    this.center = {
        "x":this.width / 2,
        "y":this.height / 2     
    }
    this.chartClass = data.chartClass; 
}

Arc.prototype.createShapeBase = function(baseSelector) {
    var width = this.width;
    var height = this.height;
    var chartClass = this.chartClass;

    var svg = d3.select(baseSelector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", chartClass)

    return svg;
}

Arc.prototype.drawShape = function(base, data) {
    var width = this.width;
    var height = this.height;
    var center = this.center;  


    var arc = d3.svg.arc()
            .innerRadius(
                function(d, i) {
                    return d.innerRadius;
                })
            .outerRadius(
                function(d, i) {
                    return d.innerRadius + d.arcWidth;
                })
            .startAngle(
                function(d, i){
                    return d.startAngle.degsToRads();
                })
            .endAngle(
                function(d, i){
                    var x= d.startAngle.degsToRads() + d.angularSize.degsToRads();
                    return x
                });

    var g = base.append("g");
    var shape = g.selectAll("path")
        .data(data)
        .enter().append("path")
        .style("fill", function(d, i){
            return d.color;
        })
        .attr("transform", "translate(" + center.x + "," + center.y + ")")
        .attr("d", arc);

    var t0 = Date.now();

    d3.timer(function(){
        var delta = Date.now() - t0;
        shape.attr("transform", function(d) {
            return "translate(" + center.x + "," + center.y + ") rotate(" + delta * d.speed + ")";
        });
    });

    return shape;
}

Arc.prototype.createAndDrawShape = function (baseSelector, data) {
    var shape, base;
    base = this.createShapeBase(baseSelector);
    shape = this.drawShape(base, data);
}

/* ARC END */

var uiHelper = {}

uiHelper._randomInRange = function (min, max) {
    return d3.scale.linear().domain([0, 1]).range([min, max])(Math.random());
};


uiHelper.randomizeData = function(sourceData, randomizationData) {
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

uiHelper.executeFunctionNTimes = function(data) {
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

/*

var initData = {
    "width":1000, 
    "height":1000, 
    "chartClass":"test-chart",  
};

var data = {
    "color":"lightgrey", 
    "innerRadius":500, 
    "arcWidth":2, 
    "startAngle":30, 
    "angularSize":45,
    "speed":0.1
};

var randomizerData = {"innerRadius":[10, 250], "startAngle":[0,360], "arcWidth":[1,7], "angularSize":[10,100], "speed":[-0.05, 0.05]};
var amount = 100
var newData = uiHelper.executeFunctionNTimes({
    "fn":uiHelper.randomizeData, 
    "fnData":[data, randomizerData], 
    "n":amount
})

arc = new Arc(initData);
arc = arc.createAndDrawShape("#holder", newData)

*/


/*

var initData = {
    "width":1000, 
    "height":1000,
    "radius":250,
    "innerRadius":200,
    "chartClass":"test-chart"
};

data = {
    "score":24,
    "width":0.8,
    "color":"lightgrey",
    "speed":0.01
};

var randomizerData = {"score":[-10, -100], "width":[0.1, 5]};
var amount = 500
var newData = uiHelper.executeFunctionNTimes({
    "fn":uiHelper.randomizeData, 
    "fnData":[data, randomizerData], 
    "n":amount
});

pie = new Pie(initData);
pie.createAndDrawShape("#holder", newData)

*/

var initData = {
    "diameter":1000,
    "format":d3.format(",d"),
    "color":d3.scale.category20c(),
    "padding":1.5
}

var data = {
 "name": "AAA",
 "children": [
    {"name": "AgglomerativeCluster", "size": 3938},
    {"name": "CommunityStructure", "size": 3812},
    {"name": "HierarchicalCluster", "size": 6714},
    {"name": "MergeEdge", "size": 743},
    {"name": "BetweennessCentrality", "size": 3534},
    {"name": "LinkDistance", "size": 5731},
    {"name": "MaxFlowMinCut", "size": 7840},
    {"name": "ShortestPaths", "size": 5914},
    {"name": "SpanningTree", "size": 3416},
    {"name": "ArrayInterpolator", "size": 1983},
    {"name": "ColorInterpolator", "size": 2047},
    {"name": "DateInterpolator", "size": 1375},
    {"name": "Interpolator", "size": 8746},
    {"name": "MatrixInterpolator", "size": 2202},
    {"name": "NumberInterpolator", "size": 1382},
    {"name": "ObjectInterpolator", "size": 1629},
    {"name": "PointInterpolator", "size": 1675},
    {"name": "RectangleInterpolator", "size": 2042},
    {"name": "ISchedulable", "size": 1041},
    {"name": "Parallel", "size": 5176},
    {"name": "Pause", "size": 449},
    {"name": "Scheduler", "size": 5593},
    {"name": "Sequence", "size": 5534},
    {"name": "Transition", "size": 9201},
    {"name": "Transitioner", "size": 19975},
    {"name": "TransitionEvent", "size": 1116},
    {"name": "Tween", "size": 6006}
 ]
}

bubbles = new Bubbles(initData);
bubbles.createAndDrawShape("#holder", data)

/* REACT STUFF */

var App = React.createClass({
    // calls the randomizer and multiplier functions 'n' times and feeds the data to the given app
    getInitialState: function() {
        var nData = uiHelper.executeFunctionNTimes({
            "fn":uiHelper.randomizeData, 
            "fnData":[this.props.data, this.props.randomizeData], 
            "n":this.props.amount
        });
        return {
            data:nData
        }
    },
    render: function() {
        return (
            <div className="App">
                <Chart data={this.state.data} />
            </div>
        )
    }
});

var Chart = React.createClass({
  propTypes: {
    //data: React.PropTypes.array,
    //domain: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    Arc.createAndDrawShape("#holder", this.props.data);
  },

  /*
  componentDidUpdate: function() {
    var el = this.getDOMNode();
    Arc.update(el, this.getChartState());
  },
  */

  getChartState: function() {
    return {
      data: this.props.data,
      domain: this.props.domain
    };
  },

  /*
  componentWillUnmount: function() {
    var el = this.getDOMNode();
    Arc.destroy(el);
  },
  */

  render: function() {
    return (
      <div className="Chart" data={this.props.data}></div>
    );
  }
});

//React.render(<App randomizeData={randomizerData} data={data} amount={amount}/>, document.getElementById("holder"));

/* REACT STUFF END */