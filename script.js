const citySelect = document.getElementById('citySelect');
const weatherInfo = document.getElementById('weatherInfo');
const errorDiv = document.getElementById('error');
const loader = document.getElementById('loader');
const recommendation = document.getElementById('recommendation');

$(document).ready(function() {
  $('#citySelect').select2();
});

window.addEventListener('load', () => {
  const savedCity = localStorage.getItem('selectedCity');
  if (savedCity) {
    citySelect.value = savedCity;
    const event = new Event('change');
    citySelect.dispatchEvent(event);
  }
});

$('#citySelect').on('change', async function () {
  const value = this.value;
  if (!value) return;
  
  console.log('Вибрано місто:', value);
 
  localStorage.setItem('selectedCity', value);

  loader.style.display = 'block';
  weatherInfo.style.opacity = 0; 
  recommendation.style.display = 'none'; 

  const [lat, lon] = value.split(',');
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ua`;

  try {
    console.log('Запит до API:', url);  
    const response = await fetch(url);
    if (!response.ok) throw new Error('Помилка при отриманні погоди');

    const data = await response.json();
    console.log('Отримані дані від API:', data); 

    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    let recommendationText = '';
    if (data.weather[0].main === 'Rain') {
      recommendationText = 'Візьміть парасолю';
    } else if (data.weather[0].main === 'Clear') {
      recommendationText = 'Носіть сонцезахисні окуляри';
    } else if (data.main.temp < 12) {
      recommendationText = 'Одягніться тепліше';
    }

    let backgroundColor = '#f0f8ff'; 
    if (data.weather[0].main === 'Rain') {
      backgroundColor = '#a4c7e6'; 
    } else if (data.weather[0].main === 'Clear') {
      backgroundColor = '#ffeb3b';
    }

    document.body.style.backgroundColor = backgroundColor;

    const html = `
      <h2>${citySelect.options[citySelect.selectedIndex].text}</h2>
      <div class="weather-icon">
        <img src="${icon}" alt="${data.weather[0].description}" />
      </div>
      <p>Температура: ${data.main.temp}°C</p>
      <p>Погода: ${data.weather[0].description}</p>
      <p>Вологість: ${data.main.humidity}%</p>
      <p>Тиск: ${data.main.pressure} гПа</p>
      <p>Вітер: ${data.wind.speed} м/с</p>
    `;
    weatherInfo.innerHTML = html;
    recommendation.textContent = recommendationText;

    localStorage.setItem('weather', html);

    loader.style.display = 'none';
    weatherInfo.style.opacity = 1;
    recommendation.style.display = 'block';
    errorDiv.textContent = '';
  } catch (error) {
    console.error('Помилка:', error);
    errorDiv.textContent = error.message;

    loader.style.display = 'none';
    weatherInfo.innerHTML = '';
    recommendation.style.display = 'none';
  }
});
