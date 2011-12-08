function bbd3_load(scripts, base) {
  for (var i=0; i < scripts.length; i++) {
    document.write('<script src="'+ base + scripts[i]+'"><\/script>')
  };
};

bbd3_load([
  "jquery.js",
  "underscore-min.js",
  "backbone.js",
  "d3.min.js",
  "d3.time.min.js",
  "d3.layout.min.js",
  "Markdown.Converter.js",
  "Markdown.Sanitizer.js"
], "scripts/");

bbd3_load(["backbone-d3.js"], "../");
bbd3_load(["footer.js"], "");