Backbone.d3.Canned['Pie'] = {
  View: Backbone.d3.PlotView.extend({
    pieData: [],  // Store current pie segment data
    modelIds: [], // Store model IDs - needed to make sure the correct pie
                  // segment is deleted
    layout: d3.layout.pie(),
    initialize: function(collection, settings) {
      Backbone.d3.PlotView.prototype.initialize.apply(this, [collection, settings]);
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
  })
}