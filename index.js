"use strict";

const timerText = document.querySelector(".js-time");

const start = document.querySelector(".js-start");
const takeLap = document.querySelector(".js-take-lap");
const stop = document.querySelector(".js-reset");
const lapList = document.querySelector(".js-laps");

let min;
let sec;
let ms;

// ==========================================================
class Timer {
  constructor({ onTick }) {
    this.startTime = null;
    this.currentTime = null;
    this.deltaTime = null;
    this.time = null;
    this.timerId = null;
    this.isActive = false;
    this.onTick = onTick;
    this.lap = [];
    this.list = null;
  }

  start() {
    if (!this.isActive) {
      this.isActive = true;
      this.startTime = Date.now() - this.deltaTime;
      this.updatetimer();
    } else {
      this.pause();
    }
  }

  pause() {
    this.isActive = false;
    start.textContent = "Continue";
    clearInterval(this.timerId);
  }

  updatetimer() {
    start.textContent = "Pause";

    this.timerId = setInterval(() => {
      this.currentTime = Date.now();
      this.deltaTime = this.currentTime - this.startTime;

      this.time = new Date(this.deltaTime);

      min = this.time.getMinutes();
      sec = this.time.getSeconds();
      ms = Number.parseInt(this.time.getMilliseconds() / 100);

      this.onTick({ min, sec, ms });
    }, 100);
  }

  takeLap() {
    this.list = document.createElement("li");

    this.time = new Date(this.deltaTime);

    min = this.time.getMinutes();
    sec = this.time.getSeconds();
    ms = Number.parseInt(this.time.getMilliseconds() / 100);

    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;
    this.list.textContent = `${min}:${sec}.${ms}`;

    if (ms > 0) {
      this.lap.push(this.list);
      this.lap.forEach(item => lapList.appendChild(item));
    }
  }

  stop() {
    start.textContent = "Start";
    lapList.textContent = "";
    clearInterval(this.timerId);
    this.isActive = false;
    this.timerId = null;
    this.startTime = null;
    this.deltaTime = null;
    this.currentTime = null;
    this.onTick({ min: 0, sec: 0, ms: 0 });
    this.list = null;
    this.lap = [];
  }
}

function updateClockFace({ min, sec, ms }) {
  if (min < 10) min = "0" + min;
  if (sec < 10) sec = "0" + sec;
  timerText.textContent = `${min}:${sec}.${ms}`;
}

const timer = new Timer({ onTick: updateClockFace });

start.addEventListener("click", timer.start.bind(timer));
stop.addEventListener("click", timer.stop.bind(timer));
takeLap.addEventListener("click", timer.takeLap.bind(timer));
