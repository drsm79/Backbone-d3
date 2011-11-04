(function(){
  Backbone.d3 = {
    PlotView = Backbone.View.extend(
      {
        this.collection.bind('change', this.redraw),
        this.collection.bind('add', this.redraw),
        this.collection.bind('remove', this.redraw),
        this.collection.bind('reset', this.draw),
        initialize: function(collection, settings){
          this.collection = collection;
          this.settings = settings;
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

    PlotCollection = Backbone.Collection.extend(
      {
        initialize: function(collection, plottype){
          this.plottype = plottype;
          this.reset(collection);
        },
        plotdata: function(){
          var data = [];
  				this.collection.forEach(function(datapoint) {
  				    data.push(datapoint.get('value'));
  				  }
				  )
				  return data;
        }
      }
    )
  }
)