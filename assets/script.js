//global variables
var APIKey = "271380b0bfa8a33cb1d80c12040623cc";
var city;
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

//query selectors

fetch(queryURL)