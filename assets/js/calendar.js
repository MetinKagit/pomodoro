

let currentYear;
let currentMonth;

let events = {};

const calendarDaysEl = document.getElementById('calendar-days');
const monthYearEl = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

const eventModal = document.getElementById('event-modal');
const closeModalBtn = document.getElementById('close-modal');
const eventForm = document.getElementById('event-form');
const eventDateInput = document.getElementById('event-date');
const eventTitleInput = document.getElementById('event-title');


 // Initialize the calendar
document.addEventListener('DOMContentLoaded', initCalendar);

function initCalendar() {
  // Get events from LS
  loadEventsFromLocalStorage();

  const today = new Date();
  currentYear = today.getFullYear();
  currentMonth = today.getMonth(); // 0 = January, 11 = December

  // Render the initial view
  renderCalendar(currentYear, currentMonth);

  // Add event listeners for navigation
  prevMonthBtn.addEventListener('click', goToPreviousMonth);
  nextMonthBtn.addEventListener('click', goToNextMonth);

  // closing the modal
  closeModalBtn.addEventListener('click', () => {
    eventModal.style.display = 'none';
  });

  // Handle form submission for adding events
  eventForm.addEventListener('submit', addEvent);
}

// Render the calendar for a given year and month
function renderCalendar(year, month) {
  // Clear previous days
  calendarDaysEl.innerHTML = '';

  // Set month-year text
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  monthYearEl.textContent = `${monthNames[month]} ${year}`;

  // First day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  // Last day of the month
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Determine the day of the week the first day falls on (0 = Sunday, 6 = Saturday)
  const startDay = firstDayOfMonth.getDay();

  // Number of days in this month
  const daysInMonth = lastDayOfMonth.getDate();

  // Calculate how many days from the previous month to display
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const daysFromPrevMonth = startDay;

  // Create day cells before the 1st of the current month (inactive days)
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const dayNum = prevMonthLastDay - (daysFromPrevMonth - 1) + i;
    const dayCell = document.createElement('div');
    dayCell.classList.add('calendar-day', 'inactive');
    dayCell.innerHTML = `<div class="day-num">${dayNum}</div>`;
    calendarDaysEl.appendChild(dayCell);
  }

  // Create day cells for the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('calendar-day');

    // Check if this day is today
    const isToday = isCurrentDay(year, month, day);
    const dayNumSpan = document.createElement('div');
    dayNumSpan.classList.add('day-num');
    if (isToday) {
      dayNumSpan.classList.add('current-day');
    }
    dayNumSpan.textContent = day;

    // Append the day number to the day cell
    dayCell.appendChild(dayNumSpan);

    // If there are events on this date, render them
    const dateKey = formatDateKey(year, month, day);
    if (events[dateKey] && events[dateKey].length) {
      events[dateKey].forEach((eventTitle, index) => {
        const eventEl = createEventElement(eventTitle, dateKey, index);
        dayCell.appendChild(eventEl);
      });
    }

    // Add click listener to open modal for adding an event
    dayCell.addEventListener('click', () => openEventModal(year, month, day));

    // Add the day cell to the container
    calendarDaysEl.appendChild(dayCell);
  }

  // Fill in any remaining cells for the next month (if the last day is not Saturday)
  const daysDisplayed = daysFromPrevMonth + daysInMonth;
  const remainingCells = 7 * 6 - daysDisplayed; 
  for (let i = 1; i <= remainingCells; i++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('calendar-day', 'inactive');
    dayCell.innerHTML = `<div class="day-num">${i}</div>`;
    calendarDaysEl.appendChild(dayCell);
  }
}

// Open the modal to add an event
function openEventModal(year, month, day) {
  // Format the date 
  const dateStr = `${year}-${padZero(month + 1)}-${padZero(day)}`;
  eventDateInput.value = dateStr;

  eventTitleInput.value = '';

  eventModal.style.display = 'block';
}

// Add an event to the calendar
function addEvent(e) {
  e.preventDefault();

  const dateStr = eventDateInput.value;
  const title = eventTitleInput.value.trim();
  if (!title) return;

  // Store the event in the "events" object
  if (!events[dateStr]) {
    events[dateStr] = [];
  }
  events[dateStr].push(title);

  // Save to LS
  saveEventsToLocalStorage();

  // Re-render calendar to show the new event
  const [year, month, day] = dateStr.split('-').map(Number);
  renderCalendar(year, month - 1);

  // Close the modal
  eventModal.style.display = 'none';
}

// Create an event element for x
function createEventElement(eventTitle, dateKey, eventIndex) {
  const eventEl = document.createElement('div');
  eventEl.classList.add('event');
  eventEl.textContent = eventTitle;

  // Add remove button
  const removeBtn = document.createElement('span');
  removeBtn.classList.add('remove-event');
  removeBtn.textContent = 'x';

  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering the open modal
    removeEvent(dateKey, eventIndex);
  });

  eventEl.appendChild(removeBtn);
  return eventEl;
}

// Remove event from the calendar
function removeEvent(dateKey, eventIndex) {
  // Remove event from array
  events[dateKey].splice(eventIndex, 1);

  // If no events left for that date, remove the dateKey
  if (events[dateKey].length === 0) {
    delete events[dateKey];
  }

  // Save updated events to LS
  saveEventsToLocalStorage();

  // Re-render the current calendar view
  renderCalendar(currentYear, currentMonth);
}

// Go to the previous month
function goToPreviousMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentYear, currentMonth);
}

// Go to the next month
function goToNextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentYear, currentMonth);
}

// Check if the date is ccurrent date
function isCurrentDay(year, month, day) {
  const today = new Date();
  return (
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day === today.getDate()
  );
}

// format the date 
function formatDateKey(year, month, day) {
  return `${year}-${padZero(month + 1)}-${padZero(day)}`;
}

// pad zero for numbers < 10
function padZero(num) {
  return num < 10 ? '0' + num : num;
}

// Save events to LS
function saveEventsToLocalStorage() {
  localStorage.setItem('calendarEvents', JSON.stringify(events));
}

//Load events from LS
function loadEventsFromLocalStorage() {
  const storedEvents = localStorage.getItem('calendarEvents');
  if (storedEvents) {
    events = JSON.parse(storedEvents);
  }
}
