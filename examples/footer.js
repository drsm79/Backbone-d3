$(function() {
  var pages = ["Index", "Bar", "Calendar", "Line", "Pie", "Scatter", "Multi view"];
  var first = true;
  $("#footer").append("<p></p>");
  var foot_div = $("#footer p");

  _.each(pages, function(page){
    if (first) {
      first = false;
    } else {
      foot_div.append(" | ");
    }
    foot_div.append("<a href='" + page.split(' ')[0].toLowerCase() + ".html'>" + page + "</a>");
  });
})