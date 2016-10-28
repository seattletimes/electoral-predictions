// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var savage = require("savage-query");
var $ = require("jquery");
var qsa = require("./lib/qsa");
var closest = require("./lib/closest");

var count;

var states = qsa("g").filter(function(s) {
  return s.getAttribute("data-name");
}).concat(qsa("polygon").filter(function(s) {
  return s.getAttribute("data-name");
})).concat(qsa("path").filter(function(s) {
  return s.getAttribute("data-name");
})).concat(qsa("circle").filter(function(s) {
  return s.getAttribute("data-name");
}));

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

  var tile = e.target;
  if (!tile.getAttribute("data-name")) {
    tile = tile.closest(".tile-container");
  }
  var state = states.filter(function(s) {
    return s.getAttribute("data-name") == tile.getAttribute("data-name");
  })[0];

  if (tile.classList.contains("red")) {
    savage(state).removeClass("red");
    savage(state).addClass("blue");
    tile.classList.remove("red");
    tile.classList.add("blue");
  } else {
    savage(state).removeClass("blue");
    savage(state).addClass("red");
    tile.classList.remove("blue");
    tile.classList.add("red");
  }
  count = 51 - ($(".red").length/2) - ($(".blue").length/2);
  if (count == 0) {
    $(".count-container").html("You're done!");
  } else if (count == 1) {
    $(".count-container").html("1 state to go!");
  } else {
    $(".count").html(count);
  }

  mapValidated = true;
  if (count !== 0) mapValidated = false;
  validate();
});

$(".st0").click(function(e) {
  if (submitted) return;

  var state = e.target;
  if (!state.getAttribute("data-name")) {
    state = state.closest("g");
  }
  var tile = tiles.filter(function(t) {
    return t.getAttribute("data-name") == state.getAttribute("data-name");
  })[0];
  console.log(tile)

  if (state.getAttribute("class") && state.getAttribute("class").includes("red")) {
    savage(state).removeClass("red");
    savage(state).addClass("blue");
    tile.classList.remove("red");
    tile.classList.add("blue");
  } else {
    savage(state).removeClass("blue");
    savage(state).addClass("red");
    tile.classList.remove("blue");
    tile.classList.add("red");
  }
  count = 51 - ($(".red").length/2) - ($(".blue").length/2);
  if (count == 0) {
    $(".count-container").html("You're done!");
  } else if (count == 1) {
    $(".count-container").html("1 state to go!");
  } else {
    $(".count").html(count);
  }

  mapValidated = true;
  if (count !== 0) mapValidated = false;
  validate();
})

$("text").click(function(e) {
  if (submitted) return;

  var stateLabel = e.target.innerHTML;
  var match = states.filter(function(s) {
    return s.getAttribute("data-name") == stateLabel;
  })[0];

  if (match.getAttribute("class") && match.getAttribute("class").includes("red")) {
    savage(match).removeClass("red");
    savage(match).addClass("blue");
  } else {
    savage(match).removeClass("blue");
    savage(match).addClass("red");
  }
  count = 102 - $(".red").length - $(".blue").length;
  if (count == 0) {
    $(".count-container").html("You're done!");
  } else if (count == 1) {
    $(".count-container").html("1 state to go!");
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

  states.forEach(function(state) {
    if (state.getAttribute("class") && state.getAttribute("class").includes("red")) {
      redArray += state.getAttribute("data-name") + " ";
    } else if (state.getAttribute("class") && state.getAttribute("class").includes("blue")) {
      blueArray += state.getAttribute("data-name") + " ";
    }
  });

  packet.red = redArray;
  packet.blue = blueArray;

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
    $("svg").addClass("submitted");
    // qsa(".blue").forEach(function(b) {
    //   savage(b).removeClass("blue");
    // });
    // qsa(".red").forEach(function(r) {
    //   savage(r).removeClass("red");
    // });
  });

});
