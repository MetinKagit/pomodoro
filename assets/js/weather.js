const apiKey = 'd44b7c01db1be8dc28a15b6e8e1b293c';
const weatherIcon = document.getElementById('weatherIcon');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const details = document.getElementById('details');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('city');

getWeatherBtn.addEventListener('click', () => {
  const city = cityInput.value;

  if (!city) {
    alert('Please enter a city name!');
    return;
  }

  // Save location to LS
  localStorage.setItem('city', city);

  // Get weather data
  getWeatherByCity(city);
});


function getWeatherByCity(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        cityName.textContent = data.name;
        temperature.textContent = `${data.main.temp}°C`;
        description.textContent = data.weather[0].description;
        details.textContent = `Feels like ${data.main.feels_like}°C • Wind: ${data.wind.speed} km/h`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.alt = data.weather[0].description;
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      alert('Error fetching weather data. Please try again.');
      console.error(error);
    });
}

// Get location from LS(Loacl Storage)
document.addEventListener('DOMContentLoaded', () => {
  const storedCity = localStorage.getItem('city');
  if (storedCity) {
    cityInput.value = storedCity;
    getWeatherByCity(storedCity);
  }
});

