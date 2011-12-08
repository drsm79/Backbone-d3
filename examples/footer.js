$(function() {
  var pages = ["Index", "Bar", "Calendar", "Line", "Pie", "Scatter", "Multi view"];
  var first = true;
  console.log($("#footer"));
  $("#footer").append("<p></p>");
  var foot_div = $("#footer p");
  console.log(foot_div);

  _.each(pages, function(page){
    console.log(page);
    if (first) {
      first = false;
    } else {
      foot_div.append(" | ");
    }
    foot_div.append("<a href='" + page.split(' ')[0].toLowerCase() + ".html'>" + page + "</a>");
  });
})