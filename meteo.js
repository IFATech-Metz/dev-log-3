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

var xmlDataRequest = new XMLHttpRequest();
var xmlForecastDataRequest = new XMLHttpRequest();
var xmlUVDataRequest = new XMLHttpRequest();
 // url général
var base_url = "http://api.openweathermap.org/data/2.5/weather";
 // url des prévisions
var forecast_url = "http://api.openweathermap.org/data/2.5/forecast";
 // url du taux d'UV
var uv_url = "http://api.openweathermap.org/data/2.5/uvi";
 // url des icônes météorologiques
var openWeatherMapFolder = "http://openweathermap.org/img/w/";

var city = "Metz";
var appid = "a2dc86b24fafbb885f09aaec75f00c65";
//3c084bd74c2f77f02d6d6c30c2018bf0
//f5e810531af1756846022c6f387acf25
//348e43383864ecfba8b0827cc402f3ff
//2956ff49de9d7e9faa3cc83cc4805ee8
//a2dc86b24fafbb885f09aaec75f00c65

var units = "metric";
var langue = "fr";
var latitude = 49.12;
var longitude = 6.18;

var previousCity = city;
var ville;

 // calcul des index pour les previsions, sur une base d'un releve toutes les 3 heures
var prevision24h = (24 / 3) - 1;
var prevision48h = (48 / 3) - 1;
var prevision72h = (72 / 3) - 1;

var debugID = "debug";

 // création de l'url météo
function get_url() {
    return base_url + "?"
        + "q=" + city + "&"
        + "appid=" + appid + "&"
        + "units=" + units + "&"
        + "lang=" + langue;
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
    document.getElementById("humidite").innerHTML = "Taux d'humidit&eacute; : "+ humidite + " %";

    var pression = response.main.pressure;
    document.getElementById("pression").innerHTML = "Pression atmosph&eacute;rique: " + pression + " hPa";

    var windDirection = response.wind.deg;
    document.getElementById("windDirection").innerHTML = "Direction du vent : " + windDirectionToString(windDirection);
    
    var windSpeed = Math.round(response.wind.speed * 3.6); // *3.6 pour passer de m/s en km/h
    document.getElementById("windSpeed").innerHTML = "Vitesse du vent : " + windSpeed + " km/h";

    var cloudPercent = response.clouds.all;
    document.getElementById("cloudPercent").innerHTML = "Couverture nuageuse : " + cloudPercent + " %";

     // Heure de lever du soleil, au format Unix-Time, converti en millisecondes
    var formattedTime;
    var unixTime = new Date(response.sys.sunrise*1000);
    var hours = unixTime.getHours();
    var minutes = "0" + unixTime.getMinutes();
    var seconds = "0" + unixTime.getSeconds();
    formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    document.getElementById("sunrise").innerHTML = "Heure de lever du soleil : " + formattedTime;

    var unixTime = new Date(response.sys.sunset*1000);
    var hours = unixTime.getHours();
    var minutes = "0" + unixTime.getMinutes();
    var seconds = "0" + unixTime.getSeconds();
    formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    document.getElementById("sunset").innerHTML = "Heure de coucher du soleil : " + formattedTime;
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

            create_IDs(JSON.parse(this.responseText));

             // la recherche du taux d'UV ne peut se faire que lorsque la récupération des données
             // du jour est terminée
            get_UV_Data();
        }
        else {
             // cas où la ville n'est pas trouvée
            cityNotFound(this.status);
        }
    };

    xmlDataRequest.open("GET", get_url(), true);
    xmlDataRequest.send();
}

 // requête de récupération des données sur 3 jours
function get_forecast_Data() {
    document.getElementById("debug").style.display = "none";

    xmlForecastDataRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("forecast_url").innerHTML = get_forecast_url();

            create_forecast_IDs(JSON.parse(this.responseText));
        }
        else {
             // cas où la ville n'est pas trouvée
            cityNotFound(this.status);
        }
    };

    xmlForecastDataRequest.open("GET", get_forecast_url(), true);
    xmlForecastDataRequest.send();
}

 // requête de récupération des données du taux UV
function get_UV_Data() {
    document.getElementById("debug").style.display = "none";

    xmlUVDataRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("uv_url").innerHTML = get_UV_url();

            create_UV_IDs(JSON.parse(this.responseText));
        }
        else {
             // cas où la ville n'est pas trouvée
            cityNotFound(this.status);
        }
    };

    xmlUVDataRequest.open("GET", get_UV_url(), true);
    xmlUVDataRequest.send();
}

 // récupération des données
function get_Data() {
     // si le checkbox visibility est coché
    if (document.getElementById("url_visibility").checked)
    {
        document.getElementById("url").style.display = "block";
        document.getElementById("forecast_url").style.display = "block";
        document.getElementById("uv_url").style.display = "block";

    }
     // sinon...
    else {
        document.getElementById("url").style.display = "none";
        document.getElementById("forecast_url").style.display = "none";
        document.getElementById("uv_url").style.display = "none";
    }

    get_currentDay_Data();
    get_forecast_Data();
}

 // initialisation de la page
function init_page() {
    get_Data();
}

 // récupération des données
function get_City_Data() {
    city = document.getElementById("ville").value;

     // test pour vérifier qu'un nom de ville a bien été entré en paramètres
    if (city == "") {
         // aucun nom de ville, on utilise le dernier nom de ville utilise
        city = previousCity;
    }
    else {
        previousCity = city;
    }

    get_Data();
}