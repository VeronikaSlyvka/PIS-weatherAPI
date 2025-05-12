// script.js

const citySelect = document.getElementById('citySelect');
const weatherInfo = document.getElementById('weatherInfo');
const errorDiv = document.getElementById('error');
const loader = document.getElementById('loader');
const recommendation = document.getElementById('recommendation');

// Ініціалізуємо бібліотеку Select2 для пошуку в списку
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

citySelect.addEventListener('change', async () => {
  const value = citySelect.value;
  if (!value) return;
  
  // Логування вибраного міста
  console.log('Вибрано місто:', value);
 
  localStorage.setItem('selectedCity', value);

  loader.style.display = 'block';
  weatherInfo.style.opacity = 0; // Приховуємо погодну інформацію
  recommendation.style.display = 'none'; // Приховуємо рекомендації

  const [lat, lon] = value.split(',');
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ua`;

  try {
    console.log('Запит до API:', url);  // Логування запиту до API
    const response = await fetch(url);
    if (!response.ok) throw new Error('Помилка при отриманні погоди');

    const data = await response.json();
    console.log('Отримані дані від API:', data);  // Логування відповіді від API

    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    // Логіка для рекомендацій
    let recommendationText = '';
    if (data.weather[0].main === 'Rain') {
      recommendationText = 'Візьміть парасолю';
    } else if (data.weather[0].main === 'Clear') {
      recommendationText = 'Носіть сонцезахисні окуляри';
    } else if (data.main.temp < 10) {
      recommendationText = 'Одягніться тепліше';
    }

    // Змінити стиль фону залежно від погодних умов
    let backgroundColor = '#f0f8ff'; // стандартний фон
    if (data.weather[0].main === 'Rain') {
      backgroundColor = '#a4c7e6'; // блакитний для дощу
    } else if (data.weather[0].main === 'Clear') {
      backgroundColor = '#ffeb3b'; // жовтий для сонця
    }

    document.body.style.backgroundColor = backgroundColor; // змінюємо фон

    const html = `
      <h2>${data.name}</h2>
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

    // Зберігаємо погоду в localStorage
    localStorage.setItem('weather', html);

    // Ховаємо спінер і показуємо інформацію
    loader.style.display = 'none';
    weatherInfo.style.opacity = 1;
    recommendation.style.display = 'block';
    errorDiv.textContent = '';
  } catch (error) {
    console.error('Помилка:', error); // Логування помилки
    errorDiv.textContent = error.message;

    // Ховаємо спінер
    loader.style.display = 'none';
    weatherInfo.innerHTML = '';
    recommendation.style.display = 'none';
  }
});
