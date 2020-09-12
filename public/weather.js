setTimeout("location.reload();", 1000*60*60);
let variables = {};
let day = {morning:{}, afternoon:{}, evening:{}, overnight:{}};
let daily = {dayOne:{}, dayTwo:{}, dayThree:{}, dayFour:{}, dayFive:{}, daySix:{}, daySeven:{}}
let weather = {current:{}, day, daily};
let current = {};
let weekdays = ["sun", "mon", "tue","wen","thur","fri","sat"];
let arrDay = ["morning","afternoon","evening","overnight"];
let arrDaily = ["dayOne","dayTwo","dayThree","dayFour","dayFive","daySix","daySeven"]

weather.current.temperature = {
    unit: "celsius"
};

(function handlePermission(){
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
        if (result.state == 'granted') {
            getLocation();
        } else if (result.state == 'prompt') {
          getLocation();
        } else if (result.state == 'denied') {

        }

    });
}());

(function initializeDays() {
    let i;
    for (i=0; i<4; i++){
        day1(day, arrDay[i], 0);
    }
    for (i=0; i<7; i++){
        day1(daily, arrDaily[i], 1);
    }
}())
function day1(object, days, x){
     object[days]['icon'] = document.getElementById('img_'+days);
    object[days]['desc'] = document.getElementById('desc_'+days);
    object[days]['temp'] = document.getElementById('temp_'+days);
    if(x === 1){
        object[days]['date'] = document.getElementById(days);
    }else{
        object[days]['time'] = document.getElementById(days);
    }
}

current.icon = document.getElementById('img_current');
current.tempValue = document.getElementById('temp_current');
current.desc = document.getElementById('desc_current');
current.locationValue = document.getElementById('town');
current.wind = document.getElementById('wind');
current.visibility = document.getElementById('visibility');
let refresh = document.getElementById("refresh");
let update = document.getElementById("update");

variables.kelvin = 273;
variables.key = "1427f5fcbed7f4a138273bcc886fe7b8";
variables.today =new Date();
variables.date = variables.today.getDate()+'-'+(variables.today.getMonth()+1)+'-'+variables.today.getFullYear();
variables.time = variables.today.getHours() + ":" + variables.today.getMinutes() + ":" + variables.today.getSeconds();

update.innerHTML = "updated as of<br>" +weekdays[variables.today.getDay()]+ ' ' +variables.date + " at " +variables.time;

function Refresh(){
    refresh.style.color = "deepskyblue";
    location.reload();
}
function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition, error);
    }else{
    alert("browser doesn't support geolocation");
    }
}

function showPosition(position) {
    variables.lat = position.coords.latitude;
    variables.lon = position.coords.longitude;
    variables.api = `https://api.openweathermap.org/data/2.5/weather?lat=${variables.lat}&lon=${variables.lon}&
    exclude={part}&appid=${variables.key}`;
    variables.api1 = `https://api.openweathermap.org/data/2.5/onecall?lat=${variables.lat}&lon=${variables.lon}&
    exclude={part}&appid=${variables.key}`;
    getWeather(variables.lat, variables.lon, variables.api,variables.api1);
}
function error(error){
    alert(error.message);
}

function getWeather(latitude, longitude, api, api1){
    fetch(api)
        .then(function (response){
            return response.json();
        })
        .then(function(data){
            weather.current.temperature.value = Math.floor(data.main.temp - variables.kelvin);
            weather.current.description = data.weather[0].description;
            weather.current.iconId = data.weather[0].icon;
            weather.current.city = data.name;
            weather.current.country = data.sys.country;
            weather.current.wind = data.wind.speed;
            weather.current.visibility = data.visibility/1000;
        })
        .then(function (){
            displayCurrent();
        })

     fetch(api1)
         .then(function (response1){
             let data1 = response1.json();
             return data1;
         })
         .then(function(data1){
             let i;
             let k = 3;
             for (i=0; i<4; i++){
                 day[arrDay[i]]['tempValue'] = Math.floor(data1.hourly[k].temp - variables.kelvin);
                 day[arrDay[i]]['iconValue'] = data1.hourly[k].weather[0].icon;
                 day[arrDay[i]]['descValue'] = data1.hourly[k].weather[0].description;
                 day[arrDay[i]]['timeValue'] = variables.today.getHours() + k;
                 k += 3;
             }
             for(i=0; i<7; i++){
                 k = i+1;
                 daily[arrDaily[i]].tempValue = Math.floor(((data1.daily[k].temp.min + data1.daily[0].temp.max)/2) - variables.kelvin);
                 daily[arrDaily[i]].iconValue = data1.daily[k].weather[0].icon;
                 daily[arrDaily[i]].descValue = data1.daily[k].weather[0].description;
                 let x = variables.today.getDay()+k;
                 if(x > 6){
                     x -= 7;
                 }
                 daily[arrDaily[i]].dateValue = weekdays[x];
             }


         })
         .then(function (){
             displayWeather();
        })
}

function displayWeather(){
    displayDay();
    displayDaily();
   }
function displayCurrent(){
    current.icon.innerHTML= `<img src="icons/${weather.current.iconId}.png" alt="weather_icon"/>`;
    current.tempValue.innerHTML = `${weather.current.temperature.value}°<span>C</span>`;
    current.desc.innerHTML = weather.current.description;
    current.locationValue.innerHTML = `${weather.current.city}, ${weather.current.country}`;
    current.wind.innerHTML = `wind ${weather.current.wind}M/S`
    current.visibility.innerHTML = `visibility ${weather.current.visibility}KM`
}
function displayDay(){
    let i;
    for (i=0; i<4; i++){
        day[arrDay[i]]['icon'].innerHTML = `<img src="icons/${day[arrDay[i]].iconValue}.png" alt="weather_icon"/>`;
        day[arrDay[i]]['temp'].innerHTML = `${day[arrDay[i]].tempValue}°<span>C</span>`;
        day[arrDay[i]]['desc'].innerHTML = day[arrDay[i]].descValue;
        if(day[arrDay[i]].timeValue >24){
            day[arrDay[i]].timeValue -= 24;
        }
        if(day[arrDay[i]].timeValue < 10){
            day[arrDay[i]]['time'].innerHTML =`0${day[arrDay[i]].timeValue} Hours`;
        }else{
            day[arrDay[i]]['time'].innerHTML =`${day[arrDay[i]].timeValue} Hours`;
        }
    }
}
function displayDaily(){
    let i;
    for (i=0; i<7; i++){
        daily[arrDaily[i]]['temp'].innerHTML = `${daily[arrDaily[i]].tempValue}°<span>C</span>`;
        daily[arrDaily[i]]['icon'].innerHTML = `<img src="icons/${daily[arrDaily[i]].iconValue}.png" alt="weather_icon"/>`;
        daily[arrDaily[i]]['desc'].innerHTML = daily[arrDaily[i]].descValue;
        daily[arrDaily[i]]['date'].innerHTML = `${daily[arrDaily[i]].dateValue}`;

    }
}

