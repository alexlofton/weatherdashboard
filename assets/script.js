//global variables
var APIKey = "271380b0bfa8a33cb1d80c12040623cc";

//query selectors
var searchInput = document.querySelector('#search-city');
var searchBtn = document.querySelector('#search-button');
var searchForm = document.querySelector('#user-form');
var currentCity = document.querySelector('.current-city-header')
var currentWeatherContent = document.querySelector('#current-weather-container');
var forecastContent = document.querySelector('#forecast');

function printResults(currentWeather, fiveDayForecasts) {
    var testArray = ["dog", "cat", "bird"]
    console.log(testArray)
    console.log(currentWeather, fiveDayForecasts)
    //current weather
    if (currentWeather.main) {
        currentWeatherContent.innerHTML += '<p><strong>Temp:</strong> ' + currentWeather.main.temp + '</p>'
        currentWeatherContent.innerHTML += '<p><strong>Feels Like:</strong> ' + currentWeather.main.feels_like + '</p>'
        currentWeatherContent.innerHTML += '<p><strong>Humidity:</strong> ' + currentWeather.main.humidity + '</p>'
    }
    //five day forecast
    // console.log('hittin')
    // return fiveDayForecasts.map(function(forecast) {
    //     console.log(forecast)
        // return forecast.main.temp
    // })
}

function searchApi(city, APIKey) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    var longitude = "";
    var latitude = "";

    fetch(queryURL)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (locRes) {
            currentCity.textContent = locRes.name
            if (!locRes) {
                console.log('No results found');
                currentWeatherContent.innerHTML = '<h3>No results found</h3>';
            } else {
                currentWeatherContent.textContent = '';
                longitude = locRes.coord.lon.toString();
                latitude = locRes.coord.lat.toString();
                searchForecastAPI(longitude, latitude, locRes);
            }
        })
    }
    
    function searchForecastAPI(longitude, latitude, currentWeatherResp) {
        var forecastQueryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey;
        var fiveDayForecasts = [];
    
    fetch(forecastQueryURL)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (locRes) {
            return locRes.list.filter(function(item) {
                var formattedTime = item.dt_txt.slice(11)

                if (formattedTime === '12:00:00') {
                    fiveDayForecasts.push(item)
                }
                return fiveDayForecasts
            })
        })
        console.log(fiveDayForecasts)
        printResults(currentWeatherResp, fiveDayForecasts)
}

function handleSearchFormSubmit(event) {
    event.preventDefault();

    var city = searchInput.value;
    console.log("testing")

    if (!city) {
        console.error('Please enter valid city');
        return;
    }

    searchApi(city, APIKey);
}

searchForm.addEventListener('submit', handleSearchFormSubmit);
