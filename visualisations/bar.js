Backbone.d3.Canned['Bar'] = {
  View: Backbone.d3.PlotView.extend(
  {
    initialize: function(collection, settings) {
      Backbone.d3.PlotView.prototype.initialize.apply(this, [collection, settings]);

  	  this.w = settings.w || 20;
      this.h = settings.h || 80;
      // TODO:
      // Store the scale in the view object so that it can be set from user
      // code. Issue is changing scale as data changes...
      // this.xscale = settings.xscale || d3.scale.linear()
      //          .domain([0, 1])
      //          .range([0, this.w])
      // this.yscale = settings.yscale || d3.scale.linear()
      //          .domain([0, 100])
      //          .rangeRound([0, this.h]);
      this.scrolling = settings.scrolling || false;
      this.size = settings.size || 5;
    },
    plotdata: function(){
      var data = [];
      this.collection.forEach(function(datapoint) {
          data.push({x:datapoint.get('x'), y:datapoint.get('y')});
        }
      )
      // Needed for scolling plots
      if (data.length > this.size){
        return _.last(data, this.size);
      } else {
        return data;
      }
    },
    plot: function(options) {
      // Copy these data to avoid closure issues below
      var w = this.w;
      var h = this.h;
      var data = this.plotdata();

      var scale = h / _.max(data, function(d) { return d.y; }).y;

      var yval = function(d) { return h - scale * d.y - .5; };

      var x = d3.scale.linear()
      .domain([0, 1])
      .range([0, w]);

      var y = d3.scale.linear()
      .domain([0, 100])
      .rangeRound([0, h]);

      if (options.newPlot) {
        var chart = this.div.append("svg:svg")
          .attr("class", "chart")
          .attr("width", w * data.length - 1)
          .attr("height", h);

        chart.selectAll("rect")
        .data(data)
        .enter().append("svg:rect")
          .attr("x", function(d, i) { return x(i) - .5; })
          .attr("y", function(d) { return yval(d) })
          .attr("width", w)
          .attr("height",
        function(d) { return scale * d.y; });

        chart.append("svg:line")
          .attr("x1", 0)
          .attr("x2", w * (1 + data.length))
          .attr("y1", h - .5)
          .attr("y2", h - .5)
          .attr("stroke", "#000");

        chart.append("svg:line")
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1", 0)
          .attr("y2", h - .5)
          .attr("stroke", "#000");
      } else if (this.scrolling) {
        var chart = this.div.selectAll("svg");
        var rect = chart.selectAll("rect")
        .data(data, function(d) { return d.x; });

        rect.enter().insert("svg:rect", "line")
          .attr("x", function(d, i) { return x(i + 1) - .5; })
          .attr("y", function(d) { return yval(d) })
          .attr("width", w)
          .attr("height", function(d) { return scale * d.y; })
        .transition()
        .duration(this.duration)
          .attr("x", function(d, i) { return x(i) - .5; });

        rect.transition()
        .duration(this.duration)
          .attr("x", function(d, i) { return x(i) - .5; })
          .attr("y", function(d, i) { return yval(d) })
          .attr("height", function(d) { return scale * d.y; });

        rect.exit()
        .transition()
        .duration(this.duration)
          .attr("x", function(d, i) { return x(i - 1) - .5; })
          .attr("y",function(d) { return yval(d) })
          .attr("height", function(d) { return scale * d.y; })
        .remove();
      } else {
        this.div.selectAll("rect")
        .data(data)
        .transition()
        .duration(this.duration)
          .attr("y", function(d) { return yval(d) })
          .attr("height", function(d) { return scale * d.y; });
      }
    }
  })
}