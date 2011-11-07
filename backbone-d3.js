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
					// TODO: make the chart a member var of the View
					// for easier access/fine grained control
        },
        draw: function() {
          // Draw the plot
          var data = this.collection.plotdata();
          this[this.collection.plottype](data, {newPlot: true});
		  		//this.caption();
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
	        var w = options.w || 20;
					var h = options.h || 80;
					data = this.collection.plotdata();
          if (options.newPlot) {
						console.log('hello');

						var x = d3.scale.linear()
							.domain([0, 1])
							.range([0, w]);

						var y = d3.scale.linear()
							.domain([0, 100])
							.rangeRound([0, h]);

						var chart = d3.select("#plot")
							.append("svg:svg")
								.attr("class", "chart")
								.attr("width", w * data.length - 1)
								.attr("height", h);

						chart.selectAll("rect")
								.data(data)
							.enter().append("svg:rect")
								.attr("x", function(d, i) { return x(i) - .5; })
								.attr("y", function(d) { return h - y(d) - .5; })
								.attr("width", w)
								.attr("height", function(d) { return y(d); });

						chart.append("svg:line")
							.attr("x1", 0)
							.attr("x2", w * data.length)
							.attr("y1", h - .5)
							.attr("y2", h - .5)
							.attr("stroke", "#000");

						console.log('woot');
					} else {
						d3.select("#plot").selectAll("rect")
							.data(data)
							.transition()
							.duration(1000)
							.attr("y", function(d) { return h - y(d) - .5; })
							.attr("height", function(d) { return y(d); });
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