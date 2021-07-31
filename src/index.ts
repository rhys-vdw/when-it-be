import { format } from "date-fns"

function dateToString(d: Date) {
  return Math.floor(d.getTime() / 60).toString(36);
}

function stringToDate(s: string) {
  return new Date(parseInt(s, 36) * 60);
}

function showCreate() {
  document.getElementById("footer")!.style.display = "none";
  const createElement = document.getElementById("create")!;
  createElement.style.display = "";
  createElement.addEventListener("submit", function (event) {
    event.preventDefault();
    const dateElement = document.querySelector("input[type=date]") as HTMLInputElement;
    const dateString = dateElement.value;
    const timeElement = document.querySelector("input[type=time]") as HTMLInputElement;
    const timeString = timeElement.value;
    const date = new Date(dateString + "T" + timeString);
    window.location.search = "?t=" + dateToString(date);
  });
}

function showTime(date, heading) {
  const headingElement = document.getElementById("heading")!;
  if (heading) {
    headingElement.innerText = heading && decodeURI(heading);

    const atElement = document.getElementById("at")!;
    atElement.innerText = Date.now() > date.getTime() ? "was at" : "will be at";

    const headerElement = document.getElementById("header")!;
    headerElement.style.display = "";
  }

  const dateAndTime = date.toISOString().slice(0, -1).split("T");

  const timeElement = document.getElementById("time") as HTMLTimeElement;
  timeElement.dateTime = dateAndTime[1];
  timeElement.innerText = format(date, "hh:mm");

  const periodElement = document.getElementById("period")!;
  periodElement.innerText = format(date, "a");

  const dateElement = document.getElementById("date") as HTMLTimeElement;
  dateElement.dateTime = dateAndTime[0];
  dateElement.innerText = format(date, "EEEE, do MMMM, yyyy");

  const tzElement = document.getElementById("tz")!;
  tzElement.innerText = date.toString().match(/\(([^)]*)/)[1];

  const showElement = document.getElementById("show")!;
  showElement.style.display = "";
}

const query = window.location.search;
const match = query.match(/[\?&]t=([^&]*)/);
const event = query.match(/[\?&]e=([^&]*)/);
if (match === null) {
  showCreate();
} else {
  const date = stringToDate(match[1]);
  console.log("date " + date.toString());
  if (isNaN(date.getTime())) {
    showCreate();
  } else {
    showTime(date, event && event[1]);
  }
}
