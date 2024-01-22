import tempMax from './img/temp-max.svg'
import humidity from './img/humidity.svg'
import cloudy from './img/cloudy.svg'
import wind from './img/wind.svg'
import search from './img/search.svg'
import feelsLike from './img/feels-like.svg'
import axios from 'axios'
import { useEffect, useState } from 'react'

function App() {
  const [weather, setWeather] = useState();
  const [location, setLocation] = useState();
  const [forecastDay, setForecastDay] = useState();
  const [searchInput, setSearchInput] = useState('');
  const [city, setCity] = useState('London'); 
  const apiKey = "288a029eb343406398675603242001";

  const fetchData = async (currentCity) => {
    try {
      const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${currentCity}&days=1&aqi=no`;
      const response = await axios.get(url, { responseType: 'json' });
      setWeather(response.data.current);
      setLocation(response.data.location);
      setForecastDay(response.data.forecast.forecastday[0].hour);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setCity(searchInput);
  }

  useEffect(() => {
    const apiKeyG = 'AIzaSyDo1CWeayV2PTl9od3dCFCZYHnBEVj1MDg';

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const apiUrlG = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKeyG}`;

          fetch(apiUrlG)
            .then(response => response.json())
            .then(data => {
              if (data.status === 'OK' && data.results.length > 0) {
                const city = data.results[0].address_components.find(component => component.types.includes('locality'));

                if (city) {
                  const cityName = city.long_name;
                  console.log(`Ваш город: ${cityName}`);
                  setCity(cityName);
                } else {
                  console.log('Город не найден.');
                }
              } else {
                console.error('Ошибка при запросе обратного геокодирования:', data.status);
              }
            })
            .catch(error => {
              console.error('Ошибка при выполнении запроса:', error);
            });
        },
        (error) => {
          console.error('Ошибка при получении геопозиции:', error.message);
        }
      );
    } else {
      console.log('Геолокация не поддерживается браузером.');
    }
  }, []); 

  useEffect(() => {
    fetchData(city);
  }, [city]);

  function getWeatherForecast(array) {
    const currentHour = new Date().getHours();
    const result = [];

    for (let i = 0; i < 4; i++) {
      const index = (currentHour + i * 3) % 24; 
      const item = array[index];
  
      result.push(
        <div className='weather-forecast__time' key={i}>
          <img src={item.condition.icon} alt="" />
          <div>
            <p>{getHoursFromTime(item.time)}</p>
            <p>{item.condition.text}</p>
          </div>
          <p>{item.temp_c}&deg;C</p>
        </div>
      );
    }
  
    return result;
  }

  const getHoursFromTime = (time) => {
    const dateObject = new Date(time);
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    return formattedTime;
  };

  return (
    <main className="container">
      {weather ? (
        <>
          <section className="main-section">
            <article className='main-section__info'>
              <p className="main-section__temp">{weather.temp_c}&deg;C</p>
              <div className="main-section__block">
                <div className="main-section__subBlock">
                  <p className="main-section__city">{location.name}</p>
                  <p className="main-section__date">{location.localtime}</p>
                </div>
                <img className='main-section__img' src={weather.condition.icon} alt="" />
              </div>
            </article>
          </section>
          <div className="bg-blur"></div>
          <aside className="weather-bar">
            <form action="" className='weather-bar__search' onSubmit={handleFormSubmit}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button><img src={search} alt="" /></button>
            </form>
            <div className="weather-details">
              <h2 className='weather-details__title'>Weather Details</h2>
              <p className='weather-details__condition'>{weather.condition.text}</p>
              <div className="weather-info">
                <div className="temp-max">
                  <p>Temperature:</p>
                  <div className="temp-max__info">
                    <p>{weather.temp_c}&deg;C</p>
                    <img src={tempMax} alt="" />
                  </div>
                </div>
                <div className="temp-min">
                  <p>Feels like:</p>
                  <div className="temp-min__info">
                    <p>{weather.feelslike_c}&deg;C</p>
                    <img src={feelsLike} alt="" />
                  </div>
                </div>
                <div className="humidity">
                  <p>Humidity:</p>
                  <div className="temp-min__info">
                    <p>{weather.humidity}&#x25;</p>
                    <img src={humidity} alt="" />
                  </div>
                </div>
                <div className="cloudy">
                  <p>Cloudy:</p>
                  <div className="temp-min__info">
                    <p>{weather.cloud}%</p>
                    <img src={cloudy} alt="" />
                  </div>
                </div>
                <div className="wind">
                  <p>Wind:</p>
                  <div className="temp-min__info">
                    <p>{weather.wind_kph} km/h</p>
                    <img src={wind} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="weather-forecast">
              <h2 className='weather-forecast__title'>Weather Forecast</h2>
              <div className='weather-forecast__timeAll'>
                {getWeatherForecast(forecastDay)}
              </div>
            </div>
          </aside>
        </>
      ) : (
        <div>Weather data is not available</div>
      )}
    </main>
  )
};
  

export default App;
