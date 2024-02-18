const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const grantAccessContainer = document.querySelector(".grant-location-container")
const userContainer = document.querySelector(".weather-container")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")

let currentTab = userTab;
currentTab.classList.add("current-tab")
const key = 'b1dff191e2787f64365f5d5faaee0443'
getfromSessionStorage()

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab")
        currentTab = clickedTab;
        currentTab.classList.add("current-tab")

        if(!searchForm.classList.contains("active")){

            userInfoContainer.classList.remove("active")
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active");
        }

        else{
            searchForm.classList.remove("active")
            userInfoContainer.classList.remove("active")
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener("click",()=>{
    switchTab(userTab)
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab)
})
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates")
    if(!localCoordinates){
        grantAccessContainer.classList.add("active")
    }


    else{
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active")
    loadingScreen.classList.add("active")

    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`)
        const data = await res.json()

        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
    }

    catch(err){

    }
}



function renderWeatherInfo(data){
    console.log(data)
    const cityName = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]")
    const desc = document.querySelector("[data-weatherInfoDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const temp = document.querySelector("[data-temp]")
    const windspeed = document.querySelector("[data-windSpeed]")
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness = document.querySelector("[data-cloud]")


    cityName.innerText = data?.name 
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
    desc.innerText = data?.weather?.[0]?.description
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png` 
    temp.innerText = `${data?.main?.temp} F`
    windspeed.innerText = data?.wind?.speed 
    humidity.innerText = data?.main?.humidity 
    cloudiness.innerText = data?.clouds?.all
}  

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }

    else{
        console.assert("your device does not have access to geolocations")
    }
}

function showPosition(position){
    const userCoordinates  = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,

    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)
}

const grantAccesButton = document.querySelector("[data-grantAccess]")
grantAccesButton.addEventListener('click', getLocation);

const searchInput = document.querySelector("[data-searchInput]")
searchTab.addEventListener("submit",(e)=>{
    e.preventDefault()
    let cityName = searchInput.value 
    if(cityName === ""){
        return
    }

    else{
        fetchSearchWeatherInfo(cityName)
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active")
    userInfoContainer.classList.remove("active")
    grantAccessContainer.classList.remove("active")


    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
        const data = await response.json();

        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
    }

    catch(err){
        console.log(err)
    }
}