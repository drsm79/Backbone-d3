function couchapp_load(scripts, base) {
  for (var i=0; i < scripts.length; i++) {
    document.write('<script src="'+ base + '/' + scripts[i]+'"><\/script>')
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
], "https://raw.github.com/drsm79/Backbone-d3/master/scripts");

couchapp_load(["backbone-d3.js"], "https://raw.github.com/drsm79/Backbone-d3/master");
