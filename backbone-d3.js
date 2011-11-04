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
          this[this.collection.plottype](data);
        },
        redraw: function(){
          // transition the plot

        },
        pie: function(data){

        },
        bar: function(data){

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