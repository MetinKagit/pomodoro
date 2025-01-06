
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const focusInput = document.getElementById("focusTime");
const breakInput = document.getElementById("breakTime");
const timerDiv = document.getElementById("timer");

// Audio alert 
const audio = new Audio("https://www.soundjay.com/button/sounds/beep-07.mp3");

let timerInterval;
let isPaused = true;
let isFocusTime = true;
let remainingTime = parseInt(focusInput.value) * 60;
let focusSessionsCompleted = 0; 

// 9 -> 09 etc.
function updateDisplay(minutes, seconds) {
  minutesDisplay.textContent = String(minutes).padStart(2, "0");
  secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

function playAudioAlert() {
  try {
    audio.play();
  } catch (error) {
    alert("Session ended!");
  }
}

// ADDED: Function to get today's localStorage key
function getTodayKey() {
  // e.g. "history-2025-01-06"
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `history-${yyyy}-${mm}-${dd}`;
}

// Save completed session to LS and DOM
function recordSessionInHistory(sessionType, sessionMinutes) {
  const sessionRecord = {
    type: sessionType,
    duration: sessionMinutes,
    timestamp: new Date().toISOString(), // optional
  };

  
  const key = getTodayKey();

  // get existing data for today
  let dailyHistory = JSON.parse(localStorage.getItem(key)) || [];

  // save new record
  dailyHistory.push(sessionRecord);

  // Write back to LS
  localStorage.setItem(key, JSON.stringify(dailyHistory));

  appendHistoryToDropdown(sessionRecord);
}

// add sesıon to the list 
function appendHistoryToDropdown(record) {
   
  const historyDropdown = document.getElementById("historyDropdown");
  
  const sessionItem = document.createElement("a");
  sessionItem.textContent = `${record.type}: ${record.duration} min`;

  // Add it to the dropdown 
  historyDropdown.appendChild(sessionItem);
}

// get today history from LS
function loadTodayHistory() {
  const key = getTodayKey();
  let dailyHistory = JSON.parse(localStorage.getItem(key)) || [];

  
  dailyHistory.forEach((rec) => {
    appendHistoryToDropdown(rec);
  });
}


loadTodayHistory();

function startTimer() {
  if (isPaused) {
    isPaused = false;
    startButton.textContent = "Pause";
    startButton.classList.remove("start");
    startButton.classList.add("pause");

    timerInterval = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        updateDisplay(minutes, seconds);
      } else {
        clearInterval(timerInterval);

        playAudioAlert();

        
        let sessionType = isFocusTime ? "Focus" : "Break";

        let sessionMinutes = isFocusTime 
          ? parseInt(focusInput.value) 
          : parseInt(breakInput.value);

        // Save session in history
        recordSessionInHistory(sessionType, sessionMinutes);

        if (isFocusTime) {
          focusSessionsCompleted++;
          alert("Focus session completed! Time for a break.");
        } else {
          alert("Break is over! Time to focus.");
        }

        // cchange session type
        isFocusTime = !isFocusTime;

        // Change timer background color
        timerDiv.style.background = isFocusTime ? "#f4fcf6" : "#fff5ba";

        // long break after evey 4 focus
        if (!isFocusTime && focusSessionsCompleted % 4 === 0) {
          remainingTime = 15 * 60; //15 min
        } else {
          remainingTime = (isFocusTime ? focusInput.value : breakInput.value) * 60;
        }

        updateDisplay(Math.floor(remainingTime / 60), 0);
        startTimer(); // Automatically start the next timer
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
    isPaused = true;
    startButton.textContent = "Start";
    startButton.classList.remove("pause");
    startButton.classList.add("start");
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isPaused = true;
  isFocusTime = true;
  focusSessionsCompleted = 0; // Reset session counter
  remainingTime = parseInt(focusInput.value) * 60;
  updateDisplay(Math.floor(remainingTime / 60), 0);
  timerDiv.style.background = "#f4fcf6"; 
  startButton.textContent = "Start";
  startButton.classList.remove("pause");
  startButton.classList.add("start");
}

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", resetTimer);

focusInput.addEventListener("change", () => {
  if (isFocusTime) {
    remainingTime = parseInt(focusInput.value) * 60;
    updateDisplay(Math.floor(remainingTime / 60), 0);
  }
});

breakInput.addEventListener("change", () => {
  if (!isFocusTime) {
    remainingTime = parseInt(breakInput.value) * 60;
    updateDisplay(Math.floor(remainingTime / 60), 0);
  }
});
