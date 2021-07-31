function dateToString(d) {
  return Math.floor(d.getTime() / 60).toString(36);
}

function stringToDate(s) {
  return new Date(parseInt(s, 36) * 60);
}

function showCreate() {
  document.getElementById("footer").style.display = "none";
  var createElement = document.getElementById("create");
  createElement.style.display = "";
  createElement.addEventListener("submit", function (event) {
    event.preventDefault();
    var dateElement = document.querySelector("input[type=date]");
    var dateString = dateElement.value;
    var dateElement = document.querySelector("input[type=time]");
    var timeString = dateElement.value;
    var date = new Date(dateString + "T" + timeString);
    window.location.search = "?t=" + dateToString(date);
  });
}

function showTime(date, heading) {
  var headingElement = document.getElementById("heading");
  if (heading) {
    headingElement.innerText = heading && decodeURI(heading);

    var atElement = document.getElementById("at");
    atElement.innerText = Date.now() > date.getTime() ? "was at" : "will be at";

    var headerElement = document.getElementById("header");
    headerElement.style.display = "";
  }

  var dateAndTime = date.toISOString().slice(0, -1).split("T");

  var timeElement = document.getElementById("time");
  timeElement.datetime = dateAndTime[1];
  timeElement.innerText = dateFns.format(date, "hh:mm");

  var periodElement = document.getElementById("period");
  periodElement.innerText = dateFns.format(date, "a");

  var dateElement = document.getElementById("date");
  dateElement.datetime = dateAndTime[0];
  dateElement.innerText = dateFns.format(date, "dddd, Do MMMM, YYYY");

  var tzElement = document.getElementById("tz");
  tzElement.innerText = date.toString().match(/\(([^)]*)/)[1];

  var showElement = document.getElementById("show");
  showElement.style.display = "";
}

var query = window.location.search;
var match = query.match(/[\?&]t=([^&]*)/);
var event = query.match(/[\?&]e=([^&]*)/);
if (match === null) {
  showCreate();
} else {
  var date = stringToDate(match[1]);
  console.log("date " + date.toString());
  if (isNaN(date.getTime())) {
    showCreate();
  } else {
    showTime(date, event && event[1]);
  }
}
