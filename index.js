let userTab = document.querySelector("#myweather");
let searchTab = document.querySelector("#searchweather");
let userContainer = document.querySelector(".weather-container");
let grantAccessContainer = document.querySelector(".grantLocation-container");
let searchForm = document.querySelector(".form-container");
let loadingScreen = document.querySelector(".loading-container");
let weatherInfoContainer = document.querySelector(".weatherInfo-container");
let grantAcessBtn = document.querySelector(".grantAccess");
let inputForm = document.querySelector("[data-searchInput]");
let searchBtn = document.querySelector(".searchBtn")
let errorImg = document.querySelector(".error")


// intially variables need
let currentTab = userTab;
let API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("currentTab");
getfromSessionStorage();

// Takes the tab as argument and shows it on the UI
function showTab(clickedTab){

    if(clickedTab != currentTab){
        currentTab.classList.remove("currentTab");
        currentTab = clickedTab;
        currentTab.classList.add("currentTab");

        if(!searchTab.classList.contains("currentTab")){
            // If I am on the search Tab an I want to show the user tab

    
            searchForm.classList.remove("active");
            weatherInfoContainer.classList.remove("active");
            // To show the user weather we want to check if the coordinates are available in session or not
            getfromSessionStorage();
                   
        }
        else if(!userTab.classList.contains("currentTab")){
            // If I am on the user Tab an I want to show the search tab
            grantAccessContainer.classList.remove("active");
            weatherInfoContainer.classList.remove("active");
            
            searchForm.classList.add("active");
            
        }
    }
}

userTab.addEventListener("click", function(){
    showTab(userTab);
});

searchTab.addEventListener("click", function(){
    showTab(searchTab);
});


function getfromSessionStorage(){
    // The coordinates will be stored in user-coordinates variable.The sessionStorage.getItem("user-coordinates") returns the value of the user-coordinates variable for the given session.If it is not present then it will return false
    let localCoordinates = sessionStorage.getItem("user-coordinates");

    // If the local coordinates are not present 
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }else{
        // When receiving data from a web server, the data is always a string.
        // Parse the data which is in string format with JSON.parse(), and the data becomes a JavaScript object.

        const coordinates = JSON.parse(localCoordinates);
        // If the coordoantes are available the get the weather info from the coordinates
        getWeatherInfo(coordinates);
    } 
}

// gets the weather info on the basis of the coordinates
async function getWeatherInfo(userCoordinates){


    let lat = userCoordinates.lat;
    let lon = userCoordinates.lon;

    

    grantAccessContainer.classList.remove("active")
    loadingScreen.classList.add("active");

    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        let data = await response.json();

        let temp = data?.main?.temp - 273.15;

        temp = temp.toFixed(2);
        loadingScreen.classList.remove("active");
        weatherInfoContainer.classList.add("active");

        errorImg.classList.remove("active");
        renderWeatherInfo(data,temp);
        
        
    }catch(e){
        loadingScreen.classList.remove("active");
        // error dispaly template

        errorImg.classList.add("active");

        
    }
}

function renderWeatherInfo(data,temp){

    let city = document.querySelector("[data-cityName]");
    let countryIcon = document.querySelector("[data-countryIcon]");
    let desc = document.querySelector("[data-weatherDesc]");
    let weatherIcon = document.querySelector("[data-weatherIcon]");
    let temperature = document.querySelector("[data-temperature]");
    let windSpeed = document.querySelector("[data-windspeed]");
    let humidity = document.querySelector("[data-Humidity]");
    let cloudiness = document.querySelector("[data-cloud]");

    console.log(data);

    
    city.innerHTML = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerHTML = data?.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather[0]?.icon}.png`;
    temperature.innerText = `${temp} °C`;
    windSpeed.innerHTML = `${data?.wind?.speed} m/s`;
    humidity.innerHTML = `${data?.main?.humidity}%`;
    cloudiness.innerHTML = `${data?.clouds.all}%`;

}

function getCoordinates(){
    
    
    
    // If the browser supports the geolocation API
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
        
    }else{
        alert("We could not get your position");
    }

}

function showposition(position){

    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    let userCoordinates = {
        lat :position.coords.latitude,
        lon :position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    getWeatherInfo(userCoordinates);
}

grantAcessBtn.addEventListener("click",getCoordinates);

searchForm.addEventListener("click", function(e){
    e.preventDefault();
    let cityName = inputForm.value;

    if(cityName === ""){
        return;
    }else{
        searchWeatherInfo(cityName);
    }
});

async function searchWeatherInfo(city){

    loadingScreen.classList.add("active");
    weatherInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data = await response.json();

        let temp = data?.main?.temp;
        temp = temp.toFixed(2);
        loadingScreen.classList.remove("active");
        weatherInfoContainer.classList.add("active");

        errorImg.classList.remove("active");
        renderWeatherInfo(data,temp);
    }catch(e){
        loadingScreen.classList.remove("active");
        errorImg.classList.add("active");
    }

}





