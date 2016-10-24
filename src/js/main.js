// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var savage = require("savage-query");
var $ = require("./lib/qsa.js");

$(".st0").forEach(function(state) {
  state.addEventListener("click", function() {
    if (state.getAttribute("class").includes("red")) {
      savage(state).removeClass("red");
      savage(state).addClass("blue");
    } else {
      savage(state).removeClass("blue");
      savage(state).addClass("red");
    }
  })
})