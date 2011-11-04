(function(){
  Backbone.d3 = {
    PlotView: Backbone.View.extend(
      {
        initialize: function(collection, settings) {
          _.bindAll(this);
          this.settings = settings;
          this.collection = collection;
          this.collection.bind('change', this.redraw);
          this.collection.bind('add', this.redraw);
          this.collection.bind('remove', this.redraw);
          this.collection.bind('reset', this.draw);
          this.collection.fetch();
        },
        draw: function() {
          // Draw the plot
          var data = this.collection.plotdata();
          this[this.collection.plottype](data, {newPlot: true});
        },
        redraw: function(){
          // transition the plot
          var that = this;
          this.collection.fetch({silent: true, success: function() {
            var data = that.collection.plotdata();
            that[that.collection.plottype](data, {newPlot: false});
          }});
        },
        pie: function(data, options){
          var m = 10, r = 100, z = d3.scale.category20c();
          if (options.newPlot) {
            var svg = d3.select("#plot").selectAll("svg")
                .data([data])
              .enter().append("svg:svg")
                .attr("width", (r + m) * 2)
                .attr("height", (r + m) * 2)
              .append("svg:g")
                .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");
            svg.selectAll("path")
              .data(d3.layout.pie())
              .enter().append("svg:path")
                .attr("d", d3.svg.arc()
                  .innerRadius(r / 8)
                  .outerRadius(r))
                .style("fill", function(d, i) { return z(i);});
          } else {
            var svg = d3.select("#plot").selectAll("svg");
            svg.data([data]);
            var pie = svg.selectAll("path");
            pie.data(d3.layout.pie());
            pie.transition()
              .attr("d", d3.svg.arc()
                .innerRadius(r / 8)
                .outerRadius(r))
              .style("fill", function(d, i) { return z(i);});
          }
        },
        bar: function(data, options){

        }
      }
    ),
    PlotCollection: Backbone.Collection.extend(
      {
        initialize: function(models, settings, plottype) {
          _.bindAll(this);
          this.settings = settings;
          this.plottype = plottype;
          this.reset(models);
        },
        plotdata: function(){
          var data = [];
				  this.forEach(function(datapoint) {
  				    data.push(datapoint.get('value'));
  				  }
				  )
				  return data;
        }
      }
    )
  }
})();