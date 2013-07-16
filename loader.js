function couchapp_load(scripts, base) {
  for (var i=0; i < scripts.length; i++) {
    document.write('<script src="'+ base + '/' + scripts[i]+'"><\/script>');
  };
};

couchapp_load([
  "jquery.js",
  "underscore-min.js",
  "backbone.js",
  "d3.min.js",
  "d3.time.min.js",
  "d3.layout.min.js",
  "Markdown.Converter.js",
  "Markdown.Sanitizer.js"
], "https://rawgithub.com/drsm79/Backbone-d3/master/examples/scripts");

couchapp_load(["backbone-d3.js"], "https://rawgithub.com/drsm79/Backbone-d3/master");
document.write('<a href="https://github.com/drsm79/Backbone-d3"><img style="position: absolute; top: 0; right: 0; border: 0;" src="http://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub" /></a>');