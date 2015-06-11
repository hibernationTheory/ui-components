/** @jsx React.DOM */

Number.prototype.degsToRads = function () {
    return d3.scale.linear().domain([0, 360]).range([0, 2 * Math.PI])(this);
};

var arc = {};

arc.createChartBase = function(baseSelector, props) {
    var width = props.width;
    var height = props.height;
    var chartClass = props.chartClass;
    var startAngle = props.startAngle;
    var endAngle = props.endAngle;
    var angularSize = props.angularSize;

    var center = {
        "x":width / 2,
        "y":height / 2
    };

    var svg = d3.select(baseSelector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", chartClass)

    return svg;
}

arc.drawChart = function(base, props) {
    var width = parseInt(base.attr("width"));
    var height = parseInt(base.attr("height"));

    var center = {
        "x":width / 2,
        "y":height / 2
    };

    var g = base.append("g");

    var color = props.color;
    var innerRadius = props.innerRadius;
    var outerRadius = props.outerRadius;
    var arcWidth = props.arcWidth;
    var startAngle = props.startAngle.degsToRads();
    var angularSize = props.angularSize.degsToRads();
    var center = {
        "x":width / 2,
        "y":height / 2
    };

    var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(innerRadius + arcWidth)
            .startAngle(function(d, i){return startAngle;})
            .endAngle(function(d, i){return startAngle + angularSize;});

    g.selectAll("path")
        .data([1])
        .enter().append("path")
        .style("fill", function(d, i){
            return props.color;
        })
        .attr("transform", "translate(" + center.x + "," + center.y + ")")
        .attr("d", arc);

    return arc;
}

var data = {
    "width":500, 
    "height":500, 
    "chartClass":"test-chart",
    "color":"lightgrey", 
    "innerRadius":100, 
    "arcWidth":2, 
    "startAngle":30, 
    "angularSize":45
};

arc.createAndDrawChart = function (baseSelector, props) {
    var base = this.createChartBase(baseSelector, props);
    var arc = this.drawChart(base, props);
}

arc.createAndDrawChart("#holder", data);

/*
var base = arc.createChartBase("#holder", {"width":500, "height":500, "chartClass":"test-chart"});
var arc = arc.drawChart(base, {"data":[1], 
    "color":"lightgrey", "innerRadius":100, "arcWidth":2, "startAngle":30, "angularSize":45});
*/
///

var Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    d3Chart.create(el, {
      width: '100%',
      height: '300px'
    }, this.getChartState());
  },

  componentDidUpdate: function() {
    var el = this.getDOMNode();
    d3Chart.update(el, this.getChartState());
  },

  getChartState: function() {
    return {
      data: this.props.data,
      domain: this.props.domain
    };
  },

  componentWillUnmount: function() {
    var el = this.getDOMNode();
    d3Chart.destroy(el);
  },

  render: function() {
    return (
      <div className="Chart"></div>
    );
  }
});