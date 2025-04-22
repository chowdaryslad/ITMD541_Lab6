// Element references
const locationSelect = document.getElementById("locationSelect");
const useMyLocation = document.getElementById("useMyLocation");
const todayGrid = document.querySelector("#today .data-grid");
const tomorrowGrid = document.querySelector("#tomorrow .data-grid");
const errorSection = document.getElementById("error");
const toggleMode = document.getElementById("toggleMode");

// === DARK/LIGHT MODE TOGGLE ===
// Load theme from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    toggleMode.checked = true;
  }
});

// Toggle and save theme
toggleMode.addEventListener("change", () => {
  const isDark = toggleMode.checked;
  document.body.classList.toggle("dark-mode", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// === API DATA FETCHING ===
// Fetch sunrise/sunset data for today and tomorrow
function fetchData(lat, lng) {
  errorSection.classList.add("hidden");
  todayGrid.innerHTML = '<p>Loading...</p>';
  tomorrowGrid.innerHTML = '<p>Loading...</p>';

  fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&date=today`)
    .then(res => res.json())
    .then(data => displayData(data.results, todayGrid))
    .catch(err => showError(err));

  fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&date=tomorrow`)
    .then(res => res.json())
    .then(data => displayData(data.results, tomorrowGrid))
    .catch(err => showError(err));
}

// Display data in the dashboard
function displayData(data, container) {
  if (!data) return;
  container.innerHTML = `
    <p><strong>Sunrise:</strong> ${data.sunrise}</p>
    <p><strong>Sunset:</strong> ${data.sunset}</p>
    <p><strong>Dawn:</strong> ${data.dawn}</p>
    <p><strong>Dusk:</strong> ${data.dusk}</p>
    <p><strong>Day Length:</strong> ${data.day_length}</p>
    <p><strong>Solar Noon:</strong> ${data.solar_noon}</p>
    <p><strong>Timezone:</strong> ${data.timezone}</p>
  `;
}

// Handle API errors
function showError(err) {
  errorSection.textContent = "Failed to load data. Please try again.";
  errorSection.classList.remove("hidden");
  todayGrid.innerHTML = "";
  tomorrowGrid.innerHTML = "";
}

// Event: Location dropdown change
locationSelect.addEventListener("change", () => {
  const coords = locationSelect.value.split(",");
  if (coords.length === 2) fetchData(coords[0], coords[1]);
});

// Event: Use current location (Geolocation API)
useMyLocation.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        fetchData(latitude, longitude);
      },
      () => showError("Unable to get location.")
    );
  } else {
    showError("Geolocation not supported.");
  }
});
