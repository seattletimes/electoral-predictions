// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var savage = require("savage-query");
var $ = require("jquery");

var count;

var states = $("[data-name]");

var tiles = $(".tile-container");

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

  var tile = $(e.target).closest(".tile-container");
  var postal = tile.attr("data-name");

  var state = states.filter(`[data-name="${postal}"]`);

  if (tile.hasClass("blue")) {
    state.removeClass("blue");
    state.addClass("red");
    tile.removeClass("blue");
    tile.addClass("red");
  } else if (tile.hasClass("red")) {
    state.removeClass("red");
    state.addClass("yellow");
    tile.removeClass("red");
    tile.addClass("yellow");
  } else {
    state.removeClass("yellow");
    state.addClass("blue");
    tile.removeClass("yellow");
    tile.addClass("blue");
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

  var state = $(e.target).closest("[data-name]");
  var postal = state.attr("data-name");

  var tile = tiles.filter(`[data-name="${postal}"]`);

  if (state.hasClass("blue")) {
    state.removeClass("blue");
    state.addClass("red");
    tile.removeClass("blue");
    tile.addClass("red");
  } else if (state.hasClass("red")) {
    state.removeClass("red");
    state.addClass("yellow");
    tile.removeClass("red");
    tile.addClass("yellow");
  } else {
    state.removeClass("yellow");
    state.addClass("blue");
    tile.removeClass("yellow");
    tile.addClass("blue");
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
  var match = states.filter(`[data-name="${stateLabel}"]`);

  var tile = tiles.filter(`[data-name="${stateLabel}"]`);

  if (tile.hasClass("blue")) {
    match.removeClass("blue");
    match.addClass("red");
    tile.removeClass("blue");
    tile.addClass("red");
  } else if (tile.hasClass("red")) {
    match.removeClass("red");
    match.addClass("yellow");
    tile.removeClass("red");
    tile.addClass("yellow");
  } else {
    match.removeClass("yellow");
    match.addClass("blue");
    tile.removeClass("yellow");
    tile.addClass("blue");
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
