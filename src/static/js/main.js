/**
 * @jsx React.DOM
 */

import { Arc } from './modules/shape_all';

Number.prototype.degsToRads = function () {
    return d3.scale.linear().domain([0, 360]).range([0, 2 * Math.PI])(this);
};


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