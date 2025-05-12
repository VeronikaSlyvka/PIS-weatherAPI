const apiKey = 'c7a8cb93d5d98c5929cfec1bb098f6b1'; 
const citySelect = document.getElementById('citySelect');
const weatherInfo = document.getElementById('weatherInfo');
const errorDiv = document.getElementById('error');
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  const savedWeather = localStorage.getItem('weather');
  if (savedWeather) {
    weatherInfo.innerHTML = savedWeather;
  }
});

citySelect.addEventListener('change', async () => {
  const value = citySelect.value;
  if (!value) return;

  // Показуємо спінер
  loader.style.display = 'block';
  weatherInfo.style.opacity = 0; // Приховуємо погодну інформацію

  const [lat, lon] = value.split(',');
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ua`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Помилка при отриманні погоди');

    const data = await response.json();
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

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
    localStorage.setItem('weather', html);

    // Ховаємо спінер і показуємо інформацію
    loader.style.display = 'none';
    weatherInfo.style.opacity = 1;
    errorDiv.textContent = '';
  } catch (error) {
    errorDiv.textContent = error.message;

    // Ховаємо спінер
    loader.style.display = 'none';
    weatherInfo.innerHTML = '';
  }
});
