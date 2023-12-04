//global variables
var APIKey = "271380b0bfa8a33cb1d80c12040623cc";

//query selectors
var searchInput = document.querySelector('#search-city');
var searchBtn = document.querySelector('#search-button');
var searchForm = document.querySelector('#user-form');
var currentCity = document.querySelector('.current-city-header');
var currentWeatherContent = document.querySelector('#current-weather-container');
var forecastContent = document.querySelector('#forecast-container');
var searchHistory = document.querySelector('#history');

function printResults(currentWeather, fiveDayForecasts) {
    var date = new Date();

    var options = { 
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit' 
    };

    var formattedCurrentDate = date.toLocaleDateString('en-US', options);

    //current weather
    if (currentWeather.main) {
        currentCity.innerHTML = " ";
        currentWeatherContent.innerHTML = " ";
        currentCity.textContent = currentWeather.name;
        
        var currentDateEl = document.createElement('h4');
        currentDateEl.textContent = formattedCurrentDate;
        currentCity.append(currentDateEl);

        currentWeatherContent.innerHTML += '<p><strong>Temp: </strong> ' + Math.round(currentWeather.main.temp) + '°F' + '</p>'

        currentWeatherContent.innerHTML += '<p><strong>Feels Like: </strong> ' + Math.round(currentWeather.main.feels_like) + '°F' + '</p>'

        currentWeatherContent.innerHTML += '<p><strong>Humidity: </strong> ' + currentWeather.main.humidity + '%' + '</p>'
    }
    forecastContent.innerHTML = " "
    //five day forecast
    return fiveDayForecasts.forEach(function(forecast) {
        var date = new Date(forecast.dt_txt);

        var formattedDate = date.toLocaleDateString('en-US', options);

        var resultCard = document.createElement('div');
        resultCard.classList.add('five-day-card', 'border', 'border-primary')

        var resultBody = document.createElement('div');
        resultBody.classList.add('five-day-body')
        resultCard.append(resultBody);

        var dateEl = document.createElement('h2');
        dateEl.classList.add('h2-date')
        dateEl.textContent = formattedDate;
        resultBody.append(dateEl);

        var forecastIcon = document.createElement('img');
        forecastIcon.setAttribute("src", `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`);
        resultBody.append(forecastIcon);

        var maxTemp = document.createElement('h4');
        maxTemp.innerHTML = '<strong>High: </strong>' + Math.round(forecast.main.temp_max) + ' °F' + '<br/>';
        resultBody.append(maxTemp);

        var minTemp = document.createElement('h4');
        minTemp.innerHTML = '<strong>Low: </strong>' + Math.round(forecast.main.temp_min) + ' °F' + '<br/>';
        resultBody.append(minTemp);

        var humidity = document.createElement('h4');
        humidity.innerHTML = '<strong>Humidity: </strong>' + Math.round(forecast.main.humidity) + '%' + '<br/>';
        resultBody.append(humidity);

        return forecastContent.append(resultCard);
    })
}

function searchApi(city, APIKey) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    var longitude = "";
    var latitude = "";

    searchInput.value = '';

    
    fetch(queryURL)
        .then(function (response) {
            if (!response.ok) {
                throw Error('Please enter a valid city');
            }
            return response.json();
        })
        .then(function (locRes) {
            if (!locRes) {
                console.log('No results found');
                currentWeatherContent.innerHTML = '<h3>No results found</h3>';
            } else {
                currentWeatherContent.textContent = '';
                longitude = locRes.coord.lon.toString();
                latitude = locRes.coord.lat.toString();
                searchForecastAPI(longitude, latitude, locRes);
            }
            return searchForecastAPI
        })
}

async function searchForecastAPI(longitude, latitude, currentWeatherResp) {
    var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey + "&units=imperial";
    var fiveDayForecasts = [];

    await fetch(forecastQueryURL)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(function (locRes) {
            locRes.list.filter(function(item) {
                var formattedTime = item.dt_txt.slice(11)

                if (formattedTime === '12:00:00') {
                fiveDayForecasts.push(item)
                }
            })
            return fiveDayForecasts;
        })  
    // console.log(currentWeatherContent, fiveDayForecasts)
    printResults(currentWeatherResp, fiveDayForecasts)
}

var searchLocalHistory = JSON.parse(localStorage.getItem("history")) || []
//setting search history to localStorage
function setLocalStorage(city) {

    searchLocalHistory.push(city)
    localStorage.setItem("history", JSON.stringify(searchLocalHistory))

    var searchHistoryItem = document.createElement('button')
    searchHistoryItem.textContent = city;
    searchHistory.append(searchHistoryItem);
}

function getUserInput() {
    //var storageKeys = Object.keys(localStorage);

    for (var i = 0; i < searchLocalHistory.length; i++) {

    var key = searchLocalHistory[i];
    //console.log(key)
   
    var retrievedUserInput = key;
    console.log(retrievedUserInput)
    var searchHistoryItem = document.createElement('button');
    searchHistoryItem.textContent = retrievedUserInput;

        // add a click event listener to each button
    searchHistoryItem.addEventListener('click', searchApi(retrievedUserInput, APIKey))

    searchHistory.append(searchHistoryItem);

  

        // Define the action to perform when the button is clicked
        console.log('Button clicked: ' + retrievedUserInput);
    };
}


function handleSearchFormSubmit(event) {
    event.preventDefault();
    
    var city = searchInput.value;

    if (!city) {
        console.error('Please enter valid city');
    }
    forecastContent.innerHTML = " "
    setLocalStorage(city);
    searchApi(city, APIKey);
}

searchBtn.addEventListener('click', handleSearchFormSubmit);
document.querySelector('#body').onload = getUserInput()