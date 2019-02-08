"use strict";

/*
  Создайте скрипт секундомера.  
  По ссылке можно посмотреть пример выбрав Stopwatch http://www.online-stopwatch.com/full-screen-stopwatch/
  
  Изначально в HTML есть разметка:
  
  <div class="stopwatch">
    <p class="time js-time">00:00.0</p>
    <button class="btn js-start">Start</button>
    <button class="btn js-take-lap">Lap</button>
    <button class="btn js-reset">Reset</button>
  </div>
  <ul class="laps js-laps"></ul>
  
  Добавьте следующий функционал:
  
  - При нажатии на кнопку button.js-start, запускается таймер, который считает время 
    со старта и до текущего момента времени, обновляя содержимое элемента p.js-time 
    новым значение времени в формате xx:xx.x (минуты:секунды.сотни_миллисекунд).
       
    🔔 Подсказка: так как необходимо отображать только сотни миллисекунд, интервал
                  достаточно повторять не чаще чем 1 раз в 100 мс.
    
  - Когда секундомер запущен, текст кнопки button.js-start меняется на 'Pause', 
    а функционал при клике превращается в оставновку секундомера без сброса 
    значений времени.
    
    🔔 Подсказка: вам понадобится буль который описывает состояние таймера активен/неактивен.
  
  - Если секундомер находится в состоянии паузы, текст на кнопке button.js-start
    меняется на 'Continue'. При следующем клике в нее, продолжается отсчет времени, 
    а текст меняется на 'Pause'. То есть если во время нажатия 'Pause' прошло 6 секунд 
    со старта, при нажатии 'Continue' 10 секунд спустя, секундомер продолжит отсчет времени 
    с 6 секунд, а не с 16. 
    
    🔔 Подсказка: сохраните время секундомера на момент паузы и используйте его 
                  при рассчете текущего времени после возобновления таймера отнимая
                  это значение от времени запуска таймера.
    
  - Если секундомер находится в активном состоянии или в состоянии паузы, кнопка 
    button.js-reset должна быть активна (на нее можно кликнуть), в противном случае
    disabled. Функционал при клике - остановка таймера и сброс всех полей в исходное состояние.
    
  - Функционал кнопки button.js-take-lap при клике - сохранение текущего времени секундомера 
    в массив и добавление в ul.js-laps нового li с сохраненным временем в формате xx:xx.x
*/
const timerText = document.querySelector(".js-time");

const start = document.querySelector(".js-start");
const takeLap = document.querySelector(".js-take-lap");
const stop = document.querySelector(".js-reset");

let min;
let sec;
let ms;

// ==========================================================
class Timer {
  constructor({ onTick }) {
    this.startTime = null;
    this.deltaTime = null;
    this.clickTime = null;
    this.timerId = null;
    this.isActive = false;
    this.onTick = onTick;
  }

  start() {
    if (!this.timerId) {
      this.isActive = true;
      this.startTime = Date.now();

     

      this.timerId = setInterval(() => {
        const currentTime = Date.now();
        this.deltaTime = currentTime - this.startTime;

        this.clickTime = new Date(this.deltaTime);

        min = this.clickTime.getMinutes();
        sec = this.clickTime.getSeconds();
        ms = Number.parseInt(this.clickTime.getMilliseconds() / 100);

        this.onTick({ min, sec, ms });
      }, 100);

      if (this.timerId) {
        
        start.textContent = "Pause";

        clearInterval(this.timerId);
      }
    }
  }

  // pause() {
  //   if (this.isActive) {
  //     this.isActive = false;
  //     start.textContent = "Pause";


  //     this.onTick({ min, sec, ms });
  //     console.log(this.clickTime);
  //   }
  // 

  stop() {
    this.isActive = false;
    clearInterval(this.timerId);
    this.timerId = null;
    this.startTime = null;
    this.deltaTime = null;
    this.onTick({ min: 0, sec: 0, ms: 0 });
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
// start.addEventListener("click", timer.pause.bind(timer), false);

