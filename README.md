# backbone-d3
With backbone-d3 we aim to provide a simple interface to visualise with d3
dynamic data held in backbone collections. The simple visualisations provided
(pie, bar, line, scatter) are as much for demonstration or testing as for wider
use. We've tried to connect two great packages without putting too much between
them.

Hopefully this means you can quickly create some basic plots of your data or
get into more sophisticated visualisations without having to fight with
asynchronous JavaScript or a lot of wrapper code.

## PlotCollection
Any backbone collection of any backbone model can be used by the plotting view.
The collection containing them can have a caption variable set which will be
rendered (using Markdown if pagedown is available) under the plot. This is all
the backbone.d3.PlotCollection does.

Some simple collections are provided for use with the canned views. If your
data maps onto these models/collections well you can just reuse them. If you
already have model/collections in use you should be able to reuse them
trivially.

## PlotView
PlotView is where the magic happens. It deals with the captioning of plots and
makes sure the appropriate actions are taken when data in the collection
changes. The PlotView defines how the data is extracted from the collection
(through the plotdata() method) and how it is rendered to the browser via the
plot() method.

The PlotView is responsible for both formatting and rendering the plot to allow
one collection to be visualised in multiple ways. The view can also hold a
caption for the visualisation, overriding the one set on the data collection.

### Streaming
As your collection changes so should your visualisation. The change/add/remove
triggers are bound to the redraw method of the plot view (reset redraws the
visualisation from scratch. This triggers a d3 transformation, updating the
plot in place with your new data. Tasty!

## The canned plot views
Each type of visualisation (should be careful about referring to them as
plots...) is a Backbone view. There are canned views for some common
visualisations, or ones we've needed ourselves, that are available in
individual files (to minimise what gets loaded) under the Backbone.d3.Canned
namespace.

If you want to create more interesting visualisations you'll be subclassing the
PlotView baseclass (please send pull requests if you make something nice!).
