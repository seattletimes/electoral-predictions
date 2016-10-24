// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var savage = require("savage-query");
var $ = require("jquery");
var closest = require("./lib/closest");

var count = 50;

$(".st0").click(function(e) {
  var state = e.target;
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
  count = 50 - $(".red").length - $(".blue").length;
  $(".count").html(count);
})

var moment = require("moment");

var panel = $(".form-panel");
var endpoint = "https://script.google.com/macros/s/AKfycbzHpXlH3ojpgoKRbOYmT9hrqkhx8S7CilllG3oHMWO2VWK7BW5O/exec";

var messageSending = panel.find(".message.sending");
var messageSuccess = panel.find(".message.success")
var submit = panel.find(".submit");
var form = panel.find("form");
var inputs = form.find("input");
var validated = false;

form.on("change keyup", function() {
  validated = true;
  inputs.each(function(i, el) {
    if (!el.value) validated = false;
  });

  if (validated) {
    submit.addClass("validated");
  } else {
    submit.removeClass("validated");
  }
})

submit.on("click", function(e) {
  if (!validated) return;
  var self = this;
  e.preventDefault();

  //handle form elements correctly
  var packet = {};
  // inputs.each(function(i, el) {
  //   packet[el.name] = el.value;
  // });
  
  packet.method = "prediction";
  packet.name = document.querySelector(".name input").value;
  packet.email = document.querySelector(".email input").value;
  packet.phone = document.querySelector(".phone input").value;
  packet.timestamp = moment(Date.now()).format('MM/DD/YY h:mm a');
  packet.red = "testing";
  packet.blue = "testing";

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
    validated = false;
    form.removeClass("validated");
    inputs.each(function(i, el) {
      el.innerHTML = "";
    })
  });

});
