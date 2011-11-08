(function(){
  Backbone.d3 = {
    PlotView: Backbone.View.extend(
      {
        initialize: function(collection, settings) {
          _.bindAll(this);
          this.collection = collection;
          this.collection.bind('change', this.redraw);
          this.collection.bind('add', this.redraw);
          this.collection.bind('remove', this.redraw);
          this.collection.bind('reset', this.draw);

          this.settings = settings || {};
					this.div = this.settings.div || d3.select("#plot");

					this.collection.fetch();
					// TODO: make the chart a member var of the View
					// for easier access/fine grained control
        },
				draw: function() {
					// Draw the plot
					if (this.collection.plotdata().length > 0) {
						this[this.collection.plottype]({newPlot: true});
		  			//this.caption();
					}
        },
        redraw: function(){
          // transition the plot
					this[this.collection.plottype]({newPlot: false});
        },
        pie: function(options){
          var data = this.collection.plotdata();
          var m = 10, r = 100, z = d3.scale.category20c();
          if (options.newPlot) {
            var svg = this.div.selectAll("svg")
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
        bar: function(options){
	        var w = options.w || 20;
					var h = options.h || 80;
          var data = this.collection.plotdata();
					var scale = h/_.max(data);
					console.log(scale);
					console.log(data.length);
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
								.attr("y", function(d) { return h - scale * y(d) - .5; })
								.attr("width", w)
								.attr("height", function(d) { return scale * y(d); });

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
					} else if (options.scrolling){
						console.log('scrolling, yo!');
					} else {
						this.div.selectAll("rect")
								.data(data)
						.transition()
							.duration(500)
							.attr("y", function(d) { return h - scale * y(d) - .5; })
							.attr("height", function(d) { return scale * y(d); });
					}
        }	// ,
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
      }
    ),
    PlotCollection: Backbone.Collection.extend(
      {
        initialize: function(models, plottype, settings) {
          _.bindAll(this);
          this.settings = settings || {};
          this.plottype = plottype || "bar";
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