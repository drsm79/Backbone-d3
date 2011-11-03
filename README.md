# backbone-d3

## the plot view

## collections
Any collection of backbone models can be used by the plotting view. The collection containing them must implement a plotdata() method and have a plottype data member (currently supported values are pie and bar). 

This library provides a backbone.dataseries collection. This is just an extension of the normal collection with a default plotdata() function and plottype variable. Extend this and treat it as a normal collection if you do not need to do anything special with your data to plot it. 
 
## streaming
As your collection changes so should your visualisation. The change trigger is bound to the redraw method of the plot view. This triggers a d3 transformation. 