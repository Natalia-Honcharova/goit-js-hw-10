import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector("[data-start]");
const dateInput = document.querySelector("#datetime-picker");

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

startBtn.disabled = true;
let userSelectedDate = null;
let timerId = null;


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= Date.now()) {
      iziToast.error({
        message: "Please choose a date in the future",
        position: "topRight",
      });

        startBtn.disabled = true;

      return;
    }

    startBtn.disabled = false;
  },
};


function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

flatpickr(dateInput, options);

startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    dateInput.disabled = true;
  timerId = setInterval(() => {
    const currentTime = Date.now();

    const deltaTime = userSelectedDate - currentTime;

     if (deltaTime <= 0) {
  clearInterval(timerId);

  daysEl.textContent = "00";
  hoursEl.textContent = "00";
  minutesEl.textContent = "00";
  secondsEl.textContent = "00";

  dateInput.disabled = false;
  startBtn.disabled = true;

  return;
}

    const { days, hours, minutes, seconds } = convertMs(deltaTime);

    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
  }, 1000);
});

