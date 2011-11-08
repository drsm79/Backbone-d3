# backbone-d3

## PlotCollection
Any collection of backbone models can be used by the plotting view. The collection containing 
them must implement a plotdata() method and have a plottype data member (currently supported 
values are pie and bar). 

This library provides a backbone.d3.PlotCollection. This is just an extension of the normal 
collection with a default plotdata() function and plottype variable. Extend this and treat it as 
a normal collection if you do not need to do anything special with your data to plot it. 
 
### Streaming
As your collection changes so should your visualisation. The change trigger is bound to the redraw 
method of the plot view. This triggers a d3 transformation, updating the plot in place with your 
new data. 


## The plot views
Each type of visualisation (should be careful about refering to them as plots...) is a Backbone
view. A helper factory function (Backbone.d3.getView) take a PlotCollection (and optoinal settings
object) and returns the appropriate view object. 
