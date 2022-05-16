const weatherForm = document.getElementById('weather-form');
const cityInput = document.querySelector('#city-input');
const weatherDisplay = document.querySelector('.weather');

const fetchWeather = async (city) => {
    // console.log(city)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=708da498299e94c381bf408beb152886`);

    const data = await response.json();

    if(data.cod === '404'){
        alert(data.message);
        return;
    }

    console.log(data);
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


const testfun = () => {
    const url = new URL("https://test.com?a=1&b=2&a=3");
    const params = new URLSearchParams(url.search);

    console.log(params.getAll('a'));
    params.append('d','4');
    console.log(params.toString());
}

testfun();