var xhr = new XMLHttpRequest();

// Forme générale du lien :
// http://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?
// date=1527811200&opacity=0.9&fill_bound=true&appid={api_key}

var base_url = "http://api.openweathermap.org/data/2.5/weather";
var city = "Metz";
var appid = "a2dc86b24fafbb885f09aaec75f00c65";
//3c084bd74c2f77f02d6d6c30c2018bf0
//f5e810531af1756846022c6f387acf25
//348e43383864ecfba8b0827cc402f3ff
//2956ff49de9d7e9faa3cc83cc4805ee8
//a2dc86b24fafbb885f09aaec75f00c65

var units = "metric";
var openWeatherMapFolder = "http://openweathermap.org/img/w/";

var previousCity;
var ville;

function get_url() {
    return base_url + "?"
        + "q=" + city + "&"
        + "appid=" + appid + "&"
        + "units=" + units;
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
    var temperature = response.main.temp;
    var icon = response.weather[0].icon;

    var humidite = response.main.humidity;
    latitude = response.coord.lat;
    longitude = response.coord.lon;
    var pression = response.main.pressure;
    var windDirection = response.wind.deg;
    var windSpeed = response.wind.speed * 3.6; // *3.6 pour passer de m/s en km/h

    document.getElementById("meteo").innerHTML = temperature;
    document.getElementById("icon").src = openWeatherMapFolder + icon + ".png";
    
    document.getElementById("humidite").innerHTML = "Humidite : "+ humidite + " %";
    document.getElementById("latitude").innerHTML = "Latitude : " + latitude;
    document.getElementById("longitude").innerHTML = "Longitude : " + longitude;
    document.getElementById("pression").innerHTML = "Pression : " + pression + " hPa";
    document.getElementById("windDirection").innerHTML = "Direction du vent : " + windDirectionToString(windDirection);
    document.getElementById("windSpeed").innerHTML = "Vitesse du vent : " + windSpeed + " km/h";
}

function get_Data() {
    document.getElementById("cityName").innerHTML = city;
    
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 & this.status == 200) {
            if (document.getElementById("url_visibility").checked) {
                document.getElementById("url").style.display = "block";

            }
            else {
                document.getElementById("url").style.display = "none";
            }

            document.getElementById("url").innerHTML = get_url();

            create_IDs(JSON.parse(this.responseText));
        }
    };

    xhr.open("GET", get_url(), true);
    xhr.send();
}

function init_page() {
    previousCity = city; // memorisation de la derniere ville consultee
    get_Data();
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