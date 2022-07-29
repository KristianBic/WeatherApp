const input = document.getElementById('searchField');
const inputButton = document.getElementById('searchButton');
const weatherLabel = document.getElementById('weather');
const locationLabe = document.getElementById('location');
const infoTxt = document.getElementById('info-txt');
const icon = document.getElementById('weather_icon');
const weatherType = document.getElementById('weather_type');
const diw = document.getElementById('day_in_week');
const content = document.getElementById('weather_content');

const apiCode = 'ae17ddc4e00f4d5c92e102543222607';
const numDays = '7';
let api;



input.addEventListener("keyup", e => {
    if (e.key == "Enter" && input.value != "") {
        requestApi(input.value);
    }
});

inputButton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation api");
    }
});

function requestApi(city = 'Bratislava') {
    // api = `http://api.weatherapi.com/v1/current.json?key=${apiCode}&q=${city}&aqi=no`;
    api = `http://api.weatherapi.com/v1/forecast.json?key=${apiCode}&q=${city}&days=${numDays}&aqi=no&alerts=no`;
    fetchData();
}

function onSuccess() {
    api = `http://api.weatherapi.com/v1/ip.json?key=${apiCode}&q=auto:ip`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    if (api === `http://api.weatherapi.com/v1/ip.json?key=${apiCode}&q=auto:ip`) {
        fetch(api).then(res => res.json()).then(result => requestApi(result.city)).catch(() => {
            infoTxt.innerText = "Something went wrong";
            infoTxt.classList.replace("pending", "error");
        });
    } else {
        fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() => {
            infoTxt.innerText = "Something went wrong";
            infoTxt.classList.replace("pending", "error");
        });
    }
}

function weatherDetails(info) {
    if (info.cod == "400") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        const city = info.location.name;
        const country = info.location.country;
        const tempC = info.current.temp_c;
        const weatherIcon = info.current.condition.icon;
        const wType = info.current.condition.text;
        const date = new Date(info.location.localtime);

        locationLabe.innerHTML = `${city}, ${country}`;
        weatherLabel.innerHTML = `${tempC}℃`;
        icon.src = weatherIcon;
        weatherType.innerHTML = wType;
        diw.innerHTML = `${dayNumberToName(date.getDay())}`;

        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
    }
}

function dayNumberToName(dayNumber) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[dayNumber];
}