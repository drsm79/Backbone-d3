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
    // time taken in transitions
    this.duration = this.settings.duration || 500;
    this.collection.fetch();

    // TODO: make the chart a member var of the View
    // for easier access/fine grained control
  },
  plotdata: function() {
    var data = [];
    this.collection.forEach(function(datapoint) {
      data.push(datapoint.get('value'));
    })
    return data;
  },
  draw: function() {
    // Draw the plot
    if (this.plotdata().length > 0) {
      this.plot({
        newPlot: true
      });
      this.caption();
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
  },
  caption: function(){
    if (this.settings.caption || this.collection.caption){
      var caption = this.settings.caption || this.collection.caption;
      if (typeof Markdown == "object") {
        try {
          var converter = Markdown.getSanitizingConverter();
          caption = converter.makeHtml(caption);
        } catch (err) {
          // do nothing
          var pass = true;
        };
      }
      var captiondiv = $('<div/>', {class: "caption", html: caption});
      $(this.settings.div).append(captiondiv);
    }
  }
});

(function() {
  Backbone.d3 = {
		PlotView: PlotView,
		PieView: PlotView.extend(
		{
		  pieData: [],  // Store current pie segment data
		  modelIds: [], // Store model IDs - needed to make sure the correct pie
		                // segment is deleted
		  layout: d3.layout.pie(),
		  initialize: function(collection, settings) {
		    PlotView.prototype.initialize.apply(this, [collection, settings]);
        this.collection.unbind('add');
        this.collection.bind('add', this.add);
        this.collection.unbind('remove');
        this.collection.bind('remove', this.remove);

        this.m = 10;
        this.radius = settings.radius || 100;
        this.colorScale = d3.scale.category20c();
        this.arc = d3.svg.arc()
          .startAngle(function(d) { return d.startAngle; })
          .endAngle(function(d) { return d.endAngle; })
		      .innerRadius(this.radius / 8)
		      .outerRadius(this.radius);
		  },
		  addDeletedSegments: function(data) {
		    /** We never really delete data from the chart as it would make existing
		     *  segments change colour. We just set the size to zero and track it in
		     *  this.deleted so we can distinguish between deleted segments and
		     *  segments that just happen to be zero.
		     *
		     *  This function puts deleted segments into the data array at the right
		     *  place.
		     */
		    _.each(this.deleted, function(d) {
		      data.splice(d, 0, 0);
		    });
		    return data;
		  },
		  add: function(model) {
		    // Add new segment to this.pieData with correct value, but set start/end
		    // angle to 2pi so it is invisible until transition completes
		    this.pieData.push({
		      data: model.get('value'),
		      value: model.get('value'),
		      startAngle: 2 * Math.PI,
		      endAngle: 2 * Math.PI
		    });
		    this.modelIds.push(model.id);
		    var data = this.addDeletedSegments(this.plotdata());
		    this.div.selectAll("svg").remove();
		    this.pieData = this.drawPie({pieData: this.pieData, data: data});
		    this.redraw();
		  },
		  remove: function(model) {
        var segment = this.modelIds.indexOf(model.id);
        var data = _.map(this.pieData, function(d) { return d.value; });
        data[segment] = 0;
        this.pieData = this.updatePie({data: data});
        if (this.deleted) {
          this.deleted.push(segment);
        } else {
          this.deleted = [segment];
        }
		  },
		  drawPie: function(options) {
        /**
         * Draw a new pie chart
         */
		    var that = this;
		    // Allow passing in of custom pieData - this can be used to add new
		    // segments by creating pieData where the new segment is zero size
		    var pieData = options.pieData || this.layout(options.data);
		    var svg = this.div.selectAll("svg")
	        .data([options.data])
          .enter().append("svg:svg")
            .attr("width", (this.radius + this.m) * 2)
            .attr("height", (this.radius + this.m) * 2)
          .append("svg:g")
            .attr("transform", "translate(" + (this.radius + this.m) + "," +
                (this.radius + this.m) + ")");
        svg.selectAll("path")
          .data(pieData)
          .enter().append("svg:path")
            .attr("d", this.arc)
          .style("fill",
            function(d, i) { return that.colorScale(i); });
        return pieData;
		  },
		  updatePie: function(options) {
        /**
         * Transition an existing pie chart
         */
		    var svg = this.div.selectAll("svg");
	      var newPieData = this.layout(options.data);
	      var that = this;
	      _.each(newPieData, function(d, i, l) {
          d.oldStartAngle = that.pieData[i].startAngle;
          d.oldEndAngle = that.pieData[i].endAngle;
	      });
	      var pie = svg.selectAll("path");
	      pie.data(newPieData);
	      pie.transition()
	        .duration(this.duration)
          .attrTween("d", function(a) {
            var i = d3.interpolate(
                {startAngle: a.oldStartAngle, endAngle: a.oldEndAngle}, a);
            return function(t) {
              return that.arc(i(t));
            };
          });
        return newPieData;
		  },
		  plot: function(options) {
	      var data = this.addDeletedSegments(this.plotdata());
	      if (options.newPlot) {
		      this.pieData = this.drawPie({data: data});
          this.modelIds = this.collection.map(function(model) {
            return model.id;
          });
        } else {
		      this.pieData = this.updatePie({data: data});
		    }
		  }
		}),
		BarView: PlotView.extend(
		{
		  initialize: function(collection, settings) {
		    PlotView.prototype.initialize.apply(this, [collection, settings]);

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
        return _.last(data, this.size);
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
		}),
		PlotCollection: Backbone.Collection.extend({
      initialize: function(models, settings) {
        _.bindAll(this);
        this.settings = settings || {};
        this.plottype = this.settings.plottype || this.plottype || "bar";
        this.caption = this.settings.caption || false;
        if (models) this.reset(models, {silent: true});
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