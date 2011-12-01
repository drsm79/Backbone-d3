Backbone.d3.Canned['Scatter'] = {
  View: Backbone.d3.PlotView.extend({
    initialize: function(collection, settings) {
      Backbone.d3.PlotView.prototype.initialize.apply(this, [collection, settings]);

  	  this.w = settings.w || 200;
      this.h = settings.h || 200;
      this.size = 20;
    },
    plot: function(options){
      var w = this.w;
      var h = this.h;
      var data = this.plotdata();

      var x = d3.scale.linear()
        .domain([0, 20])
        .range([0, w]);

      var y = d3.scale.linear()
        .domain([-1, 1])
        .rangeRound([10, h - 10]);

      // Draw axes & label

      // Scatter
      var chart = null;
      if (options.newPlot) {
        chart = this.div.append("svg:svg");
        chart.selectAll("circle")
          .data(data).enter().append("svg:circle")
          .attr("cx", function(d) { return x(d.x) })
          .attr("cy", function(d) { return y(d.y) })
          .attr("r", 0)
        .transition()
    		  .duration(this.duration)
    		    .attr("r", 5);
      } else {
        chart = this.div.selectAll("svg");
        var circle = chart.selectAll("circle").data(data);
        circle.enter().insert("svg:circle", "circle")
            .attr("cx", function(d, i) { return x(d.x) })
            .attr("cy", function(d) { return y(d.y) })
            .attr("id", function(d) { return d.x + '-' + d.y })
            .attr("r", 0)
          .transition()
  		      .duration(this.duration)
  		        .attr("r", 5);
      }
      // TODO: label points
      // TODO: different shapes
      // TODO: support multiple datasets in one scat

    },
    plotdata: function(){
      var data = [];
      this.collection.forEach(function(datapoint) {
          data.push({x:datapoint.get('x'), y:datapoint.get('y')});
        }
      )
      // Needed for scolling plots
      if (data.length > this.size) {
        return _.last(data, this.size);
      } else {
        return data;
      }
    }
  })
}