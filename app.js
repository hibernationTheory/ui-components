/**
 * @jsx React.DOM
 */
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

/* ZOOM BUBBLES */

var ZoomBubbles = function(initData) {
    this.diameter = initData.diameter || d3.min([window.innerWidth, window.innerHeight]);
    this.margin = initData.margin || 0;
    this.padding = initData.padding || 0;
    this.color = initData.color || d3.scale.category10();
    this.format = initData.format || d3.format(",d");
    this.chartClass = initData.chartClass || "temp-class"; 
    }

ZoomBubbles.prototype.createShapeBase = function(baseSelector) {
    var width = this.diameter;
    var height = this.diameter;
    var chartClass = this.chartClass;

    var svg = d3.select(baseSelector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", chartClass)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
    return svg;
}

ZoomBubbles.prototype.drawShape = function(base, data) {
    var margin = this.margin;
    var diameter = this.diameter;
    var self = this;

    var pack = d3.layout.pack()
        .padding(2)
        .size([diameter - margin, diameter - margin])
        .value(function(d) { return d.size; })

    var focus = data,
        nodes = pack.nodes(data),
        view;

    var shape = base.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
        .style("fill", function(d) { return d.children ? self.color(d.depth) : null; })
        .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

    var text = base.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function(d) { return d.parent === data ? 1 : 0; })
        .style("display", function(d) { return d.parent === data ? null : "none"; })
        .text(function(d) { return d.name; });

    var node = base.selectAll("circle,text");

    d3.select("body")
        .style("background", this.color(-1))
        .on("click", function() { zoom(data); });

    zoomTo([data.x, data.y, data.r * 2 + margin]);

    function zoom(d) {
      var focus0 = focus; focus = d;

      var transition = d3.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", function(d) {
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
            return function(t) { zoomTo(i(t)); };
          });

      transition.selectAll("text")
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
          .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
          .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }

    function zoomTo(v) {
      var k = diameter / v[2]; view = v;
      node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
      shape.attr("r", function(d) { return d.r * k; });
    }
}

/* ZOOM BUBBLES END */

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

/* PACKED BUBBLES */

var PackedBubbles = function(data) {
    this.padding = data.padding;
    this.diameter = data.diameter;
    this.color = data.color;
    this.format = data.format;
    this.chartClass = data.chartClass; 
}

PackedBubbles.prototype.createShapeBase = function(baseSelector) {
    var width = this.diameter;
    var height = this.diameter;
    var chartClass = this.chartClass;

    var svg = d3.select(baseSelector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", chartClass)

    return svg;
}

PackedBubbles.prototype.drawShape = function(base, data) {
    var diameter = this.diameter;
    var padding = this.padding;
    var self = this;

    var pack = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .value(function(d) { return d.size; })

    var g = base.append("g");

    var shape = g.datum(data)
        .selectAll(".node")
        .data(pack.nodes)
        .enter().append("g")
        .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    shape.append("title")
        .text(function(d) { return d.name + (d.children ? "" : ": " + self.format(d.size)); });

    shape.append("circle")
        .attr("r", function(d) { return d.r; })
        //.style("fill", function(d) { return self.color(d.packageName); });

    shape.filter(function(d) { return !d.children; }).append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.name.substring(0, d.r / 3); });
    
    return shape;
}

PackedBubbles.prototype.createAndDrawShape = function (baseSelector, data) {
    var shape, base;
    base = this.createShapeBase(baseSelector);
    shape = this.drawShape(base, data);
}

/* PACKED BUBBLES END */

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

/* REACT STUFF */

/*

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

  getChartState: function() {
    return {
      data: this.props.data,
      domain: this.props.domain
    };
  },

  render: function() {
    return (
      <div className="Chart" data={this.props.data}></div>
    );
  }
});

*/

/* full version for reference purposes */

/*
var Chart = React.createClass({
  propTypes: {
    //data: React.PropTypes.array,
    //domain: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    Arc.createAndDrawShape("#holder", this.props.data);
  },

  componentDidUpdate: function() {
    var el = this.getDOMNode();
    Arc.update(el, this.getChartState());
  },

  getChartState: function() {
    return {
      data: this.props.data,
      domain: this.props.domain
    };
  },

  componentWillUnmount: function() {
    var el = this.getDOMNode();
    Arc.destroy(el);
  },

  render: function() {
    return (
      <div className="Chart" data={this.props.data}></div>
    );
  }
});

*/

/* */

//React.render(<App randomizeData={randomizerData} data={data} amount={amount}/>, document.getElementById("holder"));

/* REACT STUFF END */