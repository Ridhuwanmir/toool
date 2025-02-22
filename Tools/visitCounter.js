// Function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Function to update visit counts
function updateVisitCounts() {
  const todayDate = getTodayDate();
  const totalVisits = localStorage.getItem('totalVisits') || 0;
  const lastVisitDate = localStorage.getItem('lastVisitDate') || '';
  let dailyVisits = localStorage.getItem('dailyVisits') || 0;

  // Increment total visits
  localStorage.setItem('totalVisits', parseInt(totalVisits) + 1);

  // Check if the last visit was on a different day
  if (lastVisitDate !== todayDate) {
    dailyVisits = 1; // Reset daily visits for a new day
  } else {
    dailyVisits = parseInt(dailyVisits) + 1; // Increment daily visits
  }

  // Update local storage
  localStorage.setItem('dailyVisits', dailyVisits);
  localStorage.setItem('lastVisitDate', todayDate);

  // Display visit counts with animation
  const totalVisitsElement = document.getElementById('total-visits');
  const dailyVisitsElement = document.getElementById('daily-visits');

  totalVisitsElement.textContent = `Total Visits: ${localStorage.getItem('totalVisits')}`;
  dailyVisitsElement.textContent = `Daily Visits: ${dailyVisits}`;

  totalVisitsElement.classList.add('fade-in');
  dailyVisitsElement.classList.add('fade-in');

  setTimeout(() => {
    totalVisitsElement.classList.remove('fade-in');
    dailyVisitsElement.classList.remove('fade-in');
  }, 1000);
}

// Call the function to update visit counts
updateVisitCounts();
