# backbone-d3
With backbone-d3 we aim to provide a simple interface to visualise with d3 dynamic data held in 
backbone collections. The simple visualisations provided (pie, bar, line) are as much for demonstration
or testing as for wider use. We've tried to connect two great packages without putting too much 
between them. 

Hopefully this means you can quickly create some basic plots of your data or get into more 
sophisticated visualisations without having to fight with asynchronous JavaScript or a lot 
Of wrapper code

## PlotCollection
Any collection of backbone models can be used by the plotting view. The collection containing 
them must implement a plotdata() method and have a plottype data member (currently supported 
values are pie and bar). 

This library provides a backbone.d3.PlotCollection. This is just an extension of the normal 
collection with a default plotdata() function and plottype variable. Extend this and treat it as 
a normal collection if you do not need to do anything special with your data to plot it. 
 
### Streaming
As your collection changes so should your visualisation. The change/add/remove triggers are bound 
to the redraw method of the plot view (reset redraws the visualisation from scratch. This triggers 
a d3 transformation, updating the plot in place with your new data. Tasty!


## The plot views
Each type of visualisation (should be careful about refering to them as plots...) is a Backbone
view. If you want to create more interesting visualizations you'll be writing views.

A helper factory function (Backbone.d3.getView) takes a PlotCollection (and optional settings
object) and returns the appropriate view object for a few canned visualisation types. 
