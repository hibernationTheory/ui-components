/**
 * @jsx React.DOM
 */

import { Arc } from './modules/shape_all';
import { ShapeHelper } from './modules/shape_helper';

Number.prototype.degsToRads = function () {
    return d3.scale.linear().domain([0, 360]).range([0, 2 * Math.PI])(this);
};


var shapeHelper = new ShapeHelper();


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
var newData = shapeHelper.executeFunctionNTimes({
    "fn":shapeHelper.randomizeData, 
    "fnData":[data, randomizerData], 
    "n":amount
})

var arc = new Arc(initData);
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
var newData = shapeHelper.executeFunctionNTimes({
    "fn":shapeHelper.randomizeData, 
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
        var nData = shapeHelper.executeFunctionNTimes({
            "fn":shapeHelper.randomizeData, 
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
    var arc = new Arc(initData);
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