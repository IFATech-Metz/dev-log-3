var xmlDataRequest = new XMLHttpRequest();
var xmlForecastDataRequest = new XMLHttpRequest();


// Forme générale du lien :
// http://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?
// date=1527811200&opacity=0.9&fill_bound=true&appid={api_key}

var base_url = "http://api.openweathermap.org/data/2.5/weather";
var forecast_url = "http://api.openweathermap.org/data/2.5/forecast";
var city = "Metz";
var appid = "a2dc86b24fafbb885f09aaec75f00c65";
//3c084bd74c2f77f02d6d6c30c2018bf0
//f5e810531af1756846022c6f387acf25
//348e43383864ecfba8b0827cc402f3ff
//2956ff49de9d7e9faa3cc83cc4805ee8
//a2dc86b24fafbb885f09aaec75f00c65

var units = "metric";
var openWeatherMapFolder = "http://openweathermap.org/img/w/";
var langue = "fr";

var previousCity;
var ville;

 // calcul des index pour les previsions, sur une base d'un releve toutes les 3 heures
var prevision24h = (24 / 3) - 1;
var prevision48h = (48 / 3) - 1;
var prevision72h = (72 / 3) - 1;

function get_url() {
    return base_url + "?"
        + "q=" + city + "&"
        + "appid=" + appid + "&"
        + "units=" + units + "&"
        + "lang=" + langue;
}

function get_forecast_url() {
    return forecast_url + "?"
        + "q=" + city + "&"
        + "appid=" + appid + "&"
        + "units=" + units + "&"
        + "lang=" + langue;
}

function  windDirectionToString(degree){
    if (degree>337.5) return 'Nord';
    if (degree>292.5) return 'Nord Ouest';
    if(degree>247.5) return 'Ouest';
    if(degree>202.5) return 'Sud Ouest';
    if(degree>157.5) return 'Sud';
    if(degree>122.5) return 'Sud Est';
    if(degree>67.5) return 'Est';
    return 'Nord Est';
}

function create_IDs(response) {
    var temperature = Math.round(response.main.temp);
    var icon = response.weather[0].icon;

    latitude = response.coord.lat;
    longitude = response.coord.lon;
    var description = response.weather[0].description;
    var humidite = response.main.humidity;
    var pression = response.main.pressure;
    var windDirection = response.wind.deg;
    var windSpeed = Math.round(response.wind.speed * 3.6); // *3.6 pour passer de m/s en km/h

    document.getElementById("meteo").innerHTML = "Temperature actuelle : " + temperature + " &#186;C";;
    document.getElementById("icon").src = openWeatherMapFolder + icon + ".png";
    
    document.getElementById("description").innerHTML = "Temps " + description;
    document.getElementById("humidite").innerHTML = "Humidite : "+ humidite + " %";
    document.getElementById("latitude").innerHTML = "Latitude : " + latitude;
    document.getElementById("longitude").innerHTML = "Longitude : " + longitude;
    document.getElementById("pression").innerHTML = "Pression : " + pression + " hPa";
    document.getElementById("windDirection").innerHTML = "Direction du vent : " + windDirectionToString(windDirection);
    document.getElementById("windSpeed").innerHTML = "Vitesse du vent : " + windSpeed + " km/h";
}

function create_forecast_IDs(response) {
     // la temperature sur 3 jours
    var oneDayTemp = Math.round(response.list[prevision24h].main.temp); // 7 = (24h / 3h) - 1
    var twoDaysTemp = Math.round(response.list[prevision48h].main.temp); // 15 = (48h / 3h) - 1
    var threeDaysTemp = Math.round(response.list[prevision72h].main.temp); // 23 = (72h / 3h) - 1
     // icones du temps sur trois jours
    var oneDayIcon = response.list[prevision24h].weather[0].icon;
    var twoDaysIcon = response.list[prevision48h].weather[0].icon;
    var threeDaysIcon = response.list[prevision72h].weather[0].icon;
     // descriptions
    var oneDayDescription = response.list[prevision24h].weather[0].description;
    var twoDaysDescription = response.list[prevision48h].weather[0].description;
    var threeDaysDescription = response.list[prevision72h].weather[0].description;

    document.getElementById("oneDayTemp").innerHTML = "Temperature prevue dans 24 heures : " + 
                                                              oneDayTemp + " &#186;C";
    document.getElementById("twoDaysTemp").innerHTML = "Temperature prevue dans 48 heures : " + 
                                                              twoDaysTemp + " &#186;C";
    document.getElementById("threeDaysTemp").innerHTML = "Temperature prevue dans 72 heures : " + 
                                                                threeDaysTemp + " &#186;C";

    document.getElementById("oneDayIcon").src = openWeatherMapFolder + oneDayIcon + ".png";
    document.getElementById("twoDaysIcon").src = openWeatherMapFolder + twoDaysIcon + ".png";
    document.getElementById("threeDaysIcon").src = openWeatherMapFolder + threeDaysIcon + ".png";

    document.getElementById("oneDayDescription").innerHTML = oneDayDescription;
    document.getElementById("twoDaysDescription").innerHTML = twoDaysDescription;
    document.getElementById("threeDaysDescription").innerHTML = threeDaysDescription;
}

function get_Data() {
    document.getElementById("cityName").innerHTML = city;
    
    xmlDataRequest.onreadystatechange = function() {
        if (this.readyState == 4 & this.status == 200) {
            if (document.getElementById("url_visibility").checked) {
                document.getElementById("url").style.display = "block";
                document.getElementById("forecast_url").style.display = "block";

            }
            else {
                document.getElementById("url").style.display = "none";
                document.getElementById("forecast_url").style.display = "none";
            }

            document.getElementById("url").innerHTML = get_url();

            create_IDs(JSON.parse(this.responseText));
        }
    };

    xmlDataRequest.open("GET", get_url(), true);
    xmlDataRequest.send();
}

function get_forecast_Data() {
    xmlForecastDataRequest.onreadystatechange = function() {
        if (this.readyState == 4 & this.status == 200) {
            document.getElementById("forecast_url").innerHTML = get_forecast_url();

            create_forecast_IDs(JSON.parse(this.responseText));
        }
    };

    xmlForecastDataRequest.open("GET", get_forecast_url(), true);
    xmlForecastDataRequest.send();
}

function init_page() {
    previousCity = city; // memorisation de la derniere ville consultee
    get_Data();
    get_forecast_Data();
}

function get_temperature() {
    city = document.getElementById("ville").value;

    if (city != "") {
        previousCity = city;
    }
    else {
        // aucun nom de ville, on utilise le dernier nom de ville utilise
        city = previousCity;
    }
    get_Data();
}