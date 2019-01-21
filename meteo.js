/*
 * Projet Météo - Groupe DevLog 03
 * Copyright (c) 2019 Anais GUILLAUME, Rouquaya MOUSS, Thiéry SAMPY
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

// Forme générale du lien :
// http://api.openweathermap.org/data/2.5/weather?q=Metz&3c084bd74c2f77f02d6d6c30c2018bf0

 // url général
var base_url = "http://api.openweathermap.org/data/2.5/weather";
 // url des prévisions
var forecast_url = "http://api.openweathermap.org/data/2.5/forecast";
 // url du taux d'UV
var uv_url = "http://api.openweathermap.org/data/2.5/uvi";
 // url des icônes météorologiques
var openWeatherMapFolder = "http://openweathermap.org/img/w/";
// url des pays 
var  

var city = "Metz";
var units = "metric";
var appid = "3c084bd74c2f77f02d6d6c30c2018bf0";
var current_date = new Date();

var year = current_date.getFullYear();
var month = current_date.getMonth() + 1;
var day = current_date.getDate();

var day_now = day + "/" + month + "/" + year;

 // création de l'url météo
function get_url() {
    return base_url + "?"
        + "q=" + city + "&"
        + "units=" + units + "&"
        + "appid=" + appid;
}

 // création de l'url des prévisions
function get_forecast_url() {
    return forecast_url + "?"
        + "q=" + city + "&"
        + "appid=" + appid + "&"
        + "units=" + units + "&"
        + "lang=" + langue;
}

 // création de l'url du taux d'UV
function get_UV_url() {
    return uv_url + "?"
        + "appid=" + appid + "&"
        + "lat=" + latitude + "&"
        + "lon=" + longitude;
}

 // détermination du sens du vent en français
function  windDirectionToString(direction){
    if (direction>337.5) return 'Nord';
    if (direction>292.5) return 'Nord Ouest';
    if(direction>247.5) return 'Ouest';
    if(direction>202.5) return 'Sud Ouest';
    if(direction>157.5) return 'Sud';
    if(direction>122.5) return 'Sud Est';
    if(direction>67.5) return 'Est';
    return 'Nord Est';
}

 // gestion d'un problème de connexion au serveur
function cityNotFound(status) {
    if ( status >= 300 ) {
         // une erreur est survenue lors de la connexion au serveur
        document.getElementById(debugID).style.display = "block";
        document.getElementById(debugID).innerHTML = "Erreur de connexion au serveur : erreur " + status;
    }
}

 // création des ID html de la météo
function create_IDs(response) {
    var temperature = Math.round(response.main.temp);
    document.getElementById("meteo").innerHTML = "Temp&eacute;rature actuelle : " + temperature + " &#186;C";

    var icon = response.weather[0].icon;
    document.getElementById("icon").src = openWeatherMapFolder + icon + ".png";

    latitude = response.coord.lat;
    longitude = response.coord.lon;
    document.getElementById("latitude").innerHTML = "Latitude : " + latitude;
    document.getElementById("longitude").innerHTML = "Longitude : " + longitude;

    var description = response.weather[0].description;
    document.getElementById("description").innerHTML = description;

    var humidite = response.main.humidity;
    document.getElementById("humidite").innerHTML = "Humidit&eacute; : "+ humidite + " %";

    var pression = response.main.pressure;
    document.getElementById("pression").innerHTML = "Pression : " + pression + " hPa";

    var windDirection = response.wind.deg;
    document.getElementById("windDirection").innerHTML = "Direction du vent : " + windDirectionToString(windDirection);
    
    var windSpeed = Math.round(response.wind.speed * 3.6); // *3.6 pour passer de m/s en km/h
    document.getElementById("windSpeed").innerHTML = "Vitesse du vent : " + windSpeed + " km/h";
}

 // création des ID html des prévisions sur 3 jours
function create_forecast_IDs(response) {
     // la temperature sur 3 jours
    var oneDayTemp = Math.round(response.list[prevision24h].main.temp); // 7 = (24h / 3h) - 1
    var twoDaysTemp = Math.round(response.list[prevision48h].main.temp); // 15 = (48h / 3h) - 1
    var threeDaysTemp = Math.round(response.list[prevision72h].main.temp); // 23 = (72h / 3h) - 1
    document.getElementById("oneDayTemp").innerHTML = "Temp&eacute;rature pr&eacute;vue dans 24 heures : " + 
                                                              oneDayTemp + " &#186;C";
    document.getElementById("twoDaysTemp").innerHTML = "Temp&eacute;rature pr&eacute;vue dans 48 heures : " + 
                                                              twoDaysTemp + " &#186;C";
    document.getElementById("threeDaysTemp").innerHTML = "Temp&eacute;rature pr&eacute;vue dans 72 heures : " + 
                                                                threeDaysTemp + " &#186;C";

     // icones du temps sur trois jours
    var oneDayIcon = response.list[prevision24h].weather[0].icon;
    var twoDaysIcon = response.list[prevision48h].weather[0].icon;
    var threeDaysIcon = response.list[prevision72h].weather[0].icon;
    document.getElementById("oneDayIcon").src = openWeatherMapFolder + oneDayIcon + ".png";
    document.getElementById("twoDaysIcon").src = openWeatherMapFolder + twoDaysIcon + ".png";
    document.getElementById("threeDaysIcon").src = openWeatherMapFolder + threeDaysIcon + ".png";

     // descriptions de la météo sur 3 jours
    var oneDayDescription = response.list[prevision24h].weather[0].description;
    var twoDaysDescription = response.list[prevision48h].weather[0].description;
    var threeDaysDescription = response.list[prevision72h].weather[0].description;
    document.getElementById("oneDayDescription").innerHTML = oneDayDescription;
    document.getElementById("twoDaysDescription").innerHTML = twoDaysDescription;
    document.getElementById("threeDaysDescription").innerHTML = threeDaysDescription;
}

 // création de l'ID html du taux d'UV
function create_UV_IDs(response) {
    document.getElementById("uv").innerHTML = "Taux d'Ultra-Violets : " + response.value;
}

 // requête de récupération des données du jour
function get_currentDay_Data() {
    document.getElementById("cityName").innerHTML = city;
    document.getElementById("debug").style.display = "none";
    
    xmlDataRequest.onreadystatechange = function() {
         // la requête est terminée
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("url").innerHTML = get_url();

            var response = JSON.parse(this.responseText);
            var temperature = response.main.temp;

            var icon = response.weather[0].icon;
            var src = "http://openweathermap.org/img/w/" + icon + ".png";

            document.getElementById("meteo").innerHTML = temperature;
            document.getElementById("icon").src = src;
        }
    };
    
    xhr.open("GET", get_url(), true);
    xhr.send();
}

function get_temperature() {
    city = document.getElementById("ville").value;

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("url").innerHTML = get_url();

            if(document.getElementById("url_visibility").checked) {
                document.getElementById("url").style.display = "block";
            }
            else {
                document.getElementById("url").style.display = "none";
            }

            var response = JSON.parse(this.responseText);
            var temperature = response.main.temp;

            var icon = response.weather[0].icon;
            var src = "http://openweathermap.org/img/w/" + icon + ".png";
            
            document.getElementById("meteo").innerHTML = temperature;
            document.getElementById("icon").src = src;

        }
    };
    
    xhr.open("GET", get_url(), true);
    xhr.send();
}