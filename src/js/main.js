// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var savage = require("savage-query");
var $ = require("./lib/qsa.js");
var closest = require("./lib/closest");

var count = 50;

$(".st0").forEach(function(state) {
  state.addEventListener("click", function() {
    if (!state.getAttribute("data-name")) {
      state = state.closest("g");
    }
    if (state.getAttribute("class") && state.getAttribute("class").includes("red")) {
      savage(state).removeClass("red");
      savage(state).addClass("blue");
    } else {
      savage(state).removeClass("blue");
      savage(state).addClass("red");
    }
    count = 50 - $(".red").length + $(".blue").length;
    document.querySelector(".count").innerHTML = count;
  })
})