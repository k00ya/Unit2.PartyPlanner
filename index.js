// API configuration for the cohort events
const COHORT_ID = "2308-ACC-PT-WEB-PT";
const EVENTS_API = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT_ID}/events`;

let appState = {
  eventsList: [],
};

// DOM element references
const eventsDisplay = document.getElementById("events");
const eventCreationForm = document.getElementById("addEvent");
eventCreationForm.addEventListener("submit", handleEventSubmission);

// Main render function
async function updateDisplay() {
  await fetchEvents();
  displayEvents();
}

// Fetch and display events initially
updateDisplay();

// Fetch the list of events from the server
async function fetchEvents() {
  try {
    let result = await fetch(EVENTS_API);
    if (!result.ok) {
      throw new Error("Could not retrieve events");
    }
    let eventData = await result.json();
    appState.eventsList = eventData.data;
  } catch (err) {
    console.error("Error during event fetch: ", err);
  }
}

// Display the events on the page
function displayEvents() {
  eventsDisplay.innerHTML = appState.eventsList.length ? "" : "<li>No events to show.</li>";
  
  appState.eventsList.forEach(eventInfo => {
    let listItem = document.createElement("li");
    listItem.innerHTML = `
      <h2>${eventInfo.name}</h2>
      <p>${eventInfo.description}</p>
      <p>${eventInfo.location}</p>
      <p>${eventInfo.date}</p>
      <button class="remove-button" data-id="${eventInfo.id}">Remove</button>
    `;
    eventsDisplay.appendChild(listItem);
  });
}

// Event listener for remove buttons
eventsDisplay.addEventListener("click", function (e) {
  if (e.target.className === 'remove-button') {
    let eventId = e.target.dataset.id;
    removeEvent(eventId);
  }
});

// Handle new event creation
async function handleEventSubmission(e) {
  e.preventDefault();
  let eventDate = new Date(eventCreationForm.date.value);

  if (isNaN(eventDate)) {
    console.error("Date provided is invalid");
    return;
  }

  let isoDate = eventDate.toISOString();
  try {
    let createResult = await fetch(EVENTS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: eventCreationForm.name.value,
        description: eventCreationForm.description.value,
        location: eventCreationForm.location.value,
        date: isoDate,
      }),
    });

    if (!createResult.ok) {
      throw new Error("Event creation failed");
    }
    updateDisplay();
  } catch (err) {
    console.error("Error during event creation: ", err);
  }
}

// Remove an event from the server
async function removeEvent(id) {
  try {
    let deleteResult = await fetch(`${EVENTS_API}/${id}`, {
      method: "DELETE",
    });

    if (!deleteResult.ok) {
      throw new Error("Event removal failed");
    }
    updateDisplay();
  } catch (err) {
    console.error("Error during event removal: ", err);
  }
}
