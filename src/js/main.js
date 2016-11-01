// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var savage = require("savage-query");
var $ = require("jquery");
var qsa = require("./lib/qsa");
var closest = require("./lib/closest");

var count;

var states = qsa("[data-name]");

var tiles = qsa(".tile-container");

var moment = require("moment");

var panel = $(".form-panel");
var endpoint = "https://script.google.com/macros/s/AKfycbzHpXlH3ojpgoKRbOYmT9hrqkhx8S7CilllG3oHMWO2VWK7BW5O/exec";

var messageSending = panel.find(".message.sending");
var messageSuccess = panel.find(".message.success")
var submit = panel.find(".submit");
var form = panel.find("form");
var inputs = form.find("input");

var formValidated = false;
var mapValidated = false;

var submitted = false;

var validate = function() {
  if (formValidated && mapValidated) {
    submit.addClass("validated");
  } else {
    submit.removeClass("validated");
  }
}

$(".tile-container").click(function(e) {
  if (submitted) return;

  var tile = closest(e.target, ".tile-container");

  var state = states.filter(function(s) {
    return s.getAttribute("data-name") == tile.getAttribute("data-name");
  })[0];

  if (tile.classList.contains("blue")) {
    savage(state).removeClass("blue");
    savage(state).addClass("red");
    tile.classList.remove("blue");
    tile.classList.add("red");
  } else if (tile.classList.contains("red")) {
    savage(state).removeClass("red");
    savage(state).addClass("yellow");
    tile.classList.remove("red");
    tile.classList.add("yellow");
  } else {
    savage(state).removeClass("yellow");
    savage(state).addClass("blue");
    tile.classList.remove("yellow");
    tile.classList.add("blue");
  }
  count = 51 - $(".tile-container.red").length - $(".tile-container.blue").length - $(".tile-container.yellow").length;
  if (count == 0) {
    $(".count-container").html("You're done!");
  } else {
    $(".count").html(count);
  }

  mapValidated = true;
  if (count !== 0) mapValidated = false;
  validate();
});

$(".st0").click(function(e) {
  if (submitted) return;

  var state = e.target.hasAttribute("data-name") ? e.target : closest(e.target, "g");

  var tile = tiles.filter(function(t) {
    return t.getAttribute("data-name") == state.getAttribute("data-name");
  })[0];

  if (state.getAttribute("class") && state.getAttribute("class").indexOf("blue") > -1) {
    savage(state).removeClass("blue");
    savage(state).addClass("red");
    tile.classList.remove("blue");
    tile.classList.add("red");
  } else if (state.getAttribute("class") && state.getAttribute("class").indexOf("red") > -1) {
    savage(state).removeClass("red");
    savage(state).addClass("yellow");
    tile.classList.remove("red");
    tile.classList.add("yellow");
  } else {
    savage(state).removeClass("yellow");
    savage(state).addClass("blue");
    tile.classList.remove("yellow");
    tile.classList.add("blue");
  }
  count = 51 - $(".tile-container.red").length - $(".tile-container.blue").length - $(".tile-container.yellow").length;

  if (count == 0) {
    $(".count-container").html("You're done!");
  } else {
    $(".count").html(count);
  }

  mapValidated = true;
  if (count !== 0) mapValidated = false;
  validate();
})

$("text").click(function(e) {
  if (submitted) return;

  var stateLabel = e.target.textContent;
  var match = states.filter(function(s) {
    return s.getAttribute("data-name") == stateLabel;
  })[0];

  var tile = tiles.filter(function(t) {
    return t.getAttribute("data-name") == stateLabel;
  })[0];

  if (tile.classList.contains("blue")) {
    savage(match).removeClass("blue");
    savage(match).addClass("red");
    tile.classList.remove("blue");
    tile.classList.add("red");
  } else if (tile.classList.contains("red")) {
    savage(match).removeClass("red");
    savage(match).addClass("yellow");
    tile.classList.remove("red");
    tile.classList.add("yellow");
  } else {
    savage(match).removeClass("yellow");
    savage(match).addClass("blue");
    tile.classList.remove("yellow");
    tile.classList.add("blue");
  }
  count = 51 - $(".tile-container.red").length - $(".tile-container.blue").length - $(".tile-container.yellow").length;

  if (count == 0) {
    $(".count-container").html("You're done!");
  } else {
    $(".count").html(count);
  }

  mapValidated = true;
  if (count !== 0) mapValidated = false;
  validate();
});

form.on("change keyup", function() {
  formValidated = true;
  inputs.each(function(i, el) {
    if (!el.value) formValidated = false;
  });

  validate();
})

submit.on("click", function(e) {
  if (!(mapValidated && formValidated)) return;

  var self = this;
  e.preventDefault();

  var packet = {};

  packet.method = "prediction";
  packet.name = document.querySelector(".name input").value;
  packet.email = document.querySelector(".email input").value;
  packet.phone = document.querySelector(".phone input").value;
  packet.timestamp = moment(Date.now()).format('MM/DD/YY h:mm a');

  var redArray = "";
  var blueArray = "";
  var yellowArray = "";

  states.forEach(function(state) {
    if (state.getAttribute("class") && state.getAttribute("class").includes("red")) {
      redArray += state.getAttribute("data-name") + " ";
    } else if (state.getAttribute("class") && state.getAttribute("class").includes("blue")) {
      blueArray += state.getAttribute("data-name") + " ";
    } else if (state.getAttribute("class") && state.getAttribute("class").includes("yellow")) {
      yellowArray += state.getAttribute("data-name") + " ";
    }
  });

  packet.red = redArray;
  packet.blue = blueArray;
  packet.yellow = yellowArray;

  var submission = $.ajax({
    url: endpoint,
    data: packet,
    dataType: "jsonp"
  });

  messageSending.addClass("visible");
  messageSuccess.removeClass("visible");

  submission.done(function(data) {
    messageSending.removeClass("visible");
    messageSuccess.addClass("visible");
    formValidated = false;
    mapValidated = false;
    submit.removeClass("validated");
    inputs.each(function(i, el) {
      el.value = "";
    })
    $(".count-container").html("Thanks for your submission.");
    submitted = true;
    $(".inner").addClass("submitted");
  });

});
