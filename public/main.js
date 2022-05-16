const weatherForm = document.getElementById('weather-form');
const cityInput = document.querySelector('#city-input');
const weatherDisplay = document.querySelector('.weather');

const fetchWeather = async (city) => {

    const response = await fetch(`/api/?q=${city}`);

    const data = await response.json();

    if(data.cod === '404'){
        alert(data.message);
        return;
    }

    const displayData = {
        cityname : data.name,
        temp : data.main.temp
    };

    addDisplay(displayData);
}

const addDisplay = (data) => {
    weatherDisplay.innerHTML = `
    <h1>Weather in ${data.cityname}</h1>
    <h2>${data.temp} degree</h2>`;
    cityInput.value = '';
}

weatherForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(cityInput.value.trim() === ''){
        alert("Please enter a city!");
    }else{
        fetchWeather(cityInput.value);
    }

})

fetchWeather('Kolkata');