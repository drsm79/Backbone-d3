var PlotView = Backbone.View.extend({
  initialize: function(collection, settings) {
    _.bindAll(this);
    this.collection = collection;
    this.collection.bind('change', this.redraw);
    this.collection.bind('add', this.redraw);
    this.collection.bind('remove', this.redraw);
    this.collection.bind('reset', this.draw);

    this.settings = settings || {};
    var divname = this.settings.div || "#plot";
    this.div = d3.select(divname)
    this.duration = this.settings.duration || 500;

    this.collection.fetch();
    // TODO: make the chart a member var of the View
    // for easier access/fine grained control
  },
  draw: function() {
    // Draw the plot
    if (this.collection.plotdata().length > 0) {
      this.plot({
        newPlot: true
      });
      //this.caption();
    }
  },
  redraw: function() {
    // transition the plot
    this.plot({
      newPlot: false
    });
  },
  plot: function() {
		if (console){	console.log("Not implemented in base class"); }
    return;
  }  // ,
    // 		caption: function(){
    // 			if (this.collection.caption){
    // 				var caption;
    // 				if (Markdown) {
    // 					var converter = Markdown.getSanitizingConverter();
    // 					caption = converter.makeHtml(this.collection.caption);
    // 				} else {
    // 					caption = this.collection.caption;
    // 				}
    // 				d3.select("#plot").write(caption);
    // 			}
    // 		}
});

(function() {
  Backbone.d3 = {
		PlotView: PlotView,
		PieView: PlotView.extend(
		{
		  pieData: [],
		  plot: function(options) {
		    var data = this.collection.plotdata();
		    var m = 10,
		    r = 100,
		    z = d3.scale.category20c();
		    var arc = d3.svg.arc()
          .startAngle(function(d) { return d.startAngle; })
          .endAngle(function(d) { return d.endAngle; })
		      .innerRadius(r / 8)
		      .outerRadius(r);
		    var pieLayout = d3.layout.pie();
		    var pieData = pieLayout(data);
		    if (options.newPlot) {
		      var svg = this.div.selectAll("svg")
		        .data([data])
            .enter().append("svg:svg")
              .attr("width", (r + m) * 2)
              .attr("height", (r + m) * 2)
            .append("svg:g")
              .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");
          svg.selectAll("path")
            .data(pieData)
            .enter().append("svg:path")
              .attr("d", arc)
            .style("fill",
              function(d, i) { return z(i); });
          this.pieData = pieData;
		    } else {
		      var svg = this.div.selectAll("svg");
		      var newPieData = pieLayout(data);
		      var that = this;
		      _.each(newPieData, function(d, i, l) {
	          d.oldStartAngle = that.pieData[i].startAngle;
	          d.oldEndAngle = that.pieData[i].endAngle;
		      });
		      this.pieData = newPieData;
		      var pie = svg.selectAll("path");
		      pie.data(newPieData);
		      pie.transition()
		        .duration(this.duration)
            .attrTween("d", function(a) {
              var i = d3.interpolate({startAngle: a.oldStartAngle, endAngle: a.oldEndAngle}, a);
              return function(t) {
                return arc(i(t));
              };
            });
		    }
		  }
		}),
		BarView: PlotView.extend(
		{
		  plot: function(options) {
		    var w = options.w || 20;
		    var h = options.h || 80;
		    var data = this.collection.plotdata();

		    var scale = d3.round(h / _.max(data, function(d) { return d.y; }).y);

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
		    } else if (this.collection.scrolling) {
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
		}),
		PlotCollection: Backbone.Collection.extend({
      initialize: function(models, plottype, settings) {
        _.bindAll(this);
        this.settings = settings || {};
        this.plottype = plottype || this.plottype || "bar";
        this.scrolling = this.settings.scrolling || false;
        this.reset(models);
      },
      plotdata: function() {
        var data = [];
        this.forEach(function(datapoint) {
          data.push(datapoint.get('value'));
        }
        )
        return data;
      }
    }),
    getView: function(collection, settings) {
			// Factory function to load a plot view by collection type
      settings = settings || {};
      if (collection.plottype == 'bar') {
        return new this.BarView(collection, settings);
      } else if (collection.plottype == 'pie') {
        return new this.PieView(collection, settings);
      }
    }
  }
})();