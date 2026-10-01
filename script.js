/* =====================================================
   WORLD WEATHER DASHBOARD
   ===================================================== */


/* =====================================================
   CONFIGURATION
   ===================================================== */

const CITY_DATA_URL = "./cities.json";

const WEATHER_API_URL =
    "https://api.open-meteo.com/v1/forecast";

const ITEMS_PER_PAGE = 10;

const CACHE_DURATION = 5 * 60 * 1000;


/* =====================================================
   APPLICATION STATE
   ===================================================== */

let cities = [];

let currentPage = 1;

let totalPages = 0;


/* =====================================================
   DOM ELEMENTS
   ===================================================== */

const weatherContainer =
    document.getElementById(
        "weather-container"
    );

const pagination =
    document.getElementById(
        "pagination"
    );

const cityCount =
    document.getElementById(
        "city-count"
    );

const pageInfo =
    document.getElementById(
        "page-info"
    );


/* =====================================================
   WEATHER CODE INFORMATION
   ===================================================== */

const WEATHER_CODES = {

    0: {
        icon: "☀️",
        description: "Clear sky"
    },

    1: {
        icon: "🌤️",
        description: "Mainly clear"
    },

    2: {
        icon: "⛅",
        description: "Partly cloudy"
    },

    3: {
        icon: "☁️",
        description: "Overcast"
    },

    45: {
        icon: "🌫️",
        description: "Fog"
    },

    48: {
        icon: "🌫️",
        description: "Rime fog"
    },

    51: {
        icon: "🌦️",
        description: "Light drizzle"
    },

    53: {
        icon: "🌦️",
        description: "Moderate drizzle"
    },

    55: {
        icon: "🌧️",
        description: "Dense drizzle"
    },

    56: {
        icon: "🌧️",
        description: "Light freezing drizzle"
    },

    57: {
        icon: "🌧️",
        description: "Dense freezing drizzle"
    },

    61: {
        icon: "🌧️",
        description: "Slight rain"
    },

    63: {
        icon: "🌧️",
        description: "Moderate rain"
    },

    65: {
        icon: "🌧️",
        description: "Heavy rain"
    },

    66: {
        icon: "🌧️",
        description: "Light freezing rain"
    },

    67: {
        icon: "🌧️",
        description: "Heavy freezing rain"
    },

    71: {
        icon: "🌨️",
        description: "Slight snow"
    },

    73: {
        icon: "🌨️",
        description: "Moderate snow"
    },

    75: {
        icon: "❄️",
        description: "Heavy snow"
    },

    77: {
        icon: "❄️",
        description: "Snow grains"
    },

    80: {
        icon: "🌦️",
        description: "Slight rain showers"
    },

    81: {
        icon: "🌦️",
        description: "Moderate rain showers"
    },

    82: {
        icon: "🌧️",
        description: "Heavy rain showers"
    },

    85: {
        icon: "🌨️",
        description: "Slight snow showers"
    },

    86: {
        icon: "🌨️",
        description: "Heavy snow showers"
    },

    95: {
        icon: "⛈️",
        description: "Thunderstorm"
    },

    96: {
        icon: "⛈️",
        description:
            "Thunderstorm with slight hail"
    },

    99: {
        icon: "⛈️",
        description:
            "Thunderstorm with heavy hail"
    }

};


/* =====================================================
   GET WEATHER INFORMATION FROM WMO CODE
   ===================================================== */

function getWeatherInfo(code) {

    return WEATHER_CODES[code] || {

        icon: "🌡️",

        description:
            "Weather information unavailable"

    };

}


/* =====================================================
   LOAD CITY DATA
   ===================================================== */

async function loadCities() {
    const response = await fetch("./cities.json");

    if (!response.ok) {
        throw new Error("Could not load cities.json");
    }

    cities = await response.json();

    //DEBUG
     if (cities.length === 0) {

            throw new Error(
                "No valid cities found."
            );

        } else {            
            for (const city of cities) {
                if (typeof city.name == "string" && typeof city.country == "string") {
                    city.name = city.name.trim();
                    city.country = city.country.trim();
                    console.log(city.name + ", " + city.country);
                } 
            }  
            console.log("Number of cities: " + cities.length);                                   
        }

    //END DEBUG

    console.log("Total cities:", cities.length);
    console.log(
        "Total pages:",
        Math.ceil(cities.length / ITEMS_PER_PAGE)
    );

    totalPages = Math.ceil(cities.length / ITEMS_PER_PAGE);

    createPagination();
    showPage(1);
}


/* =====================================================
   FETCH WEATHER FOR CURRENT PAGE
   ===================================================== */

async function getWeatherForCities(
    citiesToFetch
) {

    const latitudes =
        citiesToFetch
            .map(city => city.latitude)
            .join(",");


    const longitudes =
        citiesToFetch
            .map(city => city.longitude)
            .join(",");


    const currentVariables = [
        "temperature_2m",
        "apparent_temperature",
        "relative_humidity_2m",
        "weather_code",
        "wind_speed_10m"
    ].join(",");


    const dailyVariables = [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "sunrise",
        "sunset",
        "precipitation_probability_max"
    ].join(",");


    const url =
        `${WEATHER_API_URL}` +
        `?latitude=${encodeURIComponent(
            latitudes
        )}` +
        `&longitude=${encodeURIComponent(
            longitudes
        )}` +
        `&current=${currentVariables}` +
        `&daily=${dailyVariables}` +
        "&forecast_days=7" +
        "&timezone=auto";


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            `Weather API returned ${response.status}`
        );

    }


    const data =
        await response.json();


    return Array.isArray(data)
        ? data
        : [data];

}


/* =====================================================
   FORMAT TIME
   ===================================================== */

function formatLocalTime(
    isoTime,
    timezone
) {

    if (!isoTime) {

        return "—";

    }


    try {

        const date =
            new Date(isoTime);


        return new Intl.DateTimeFormat(
            "en",
            {
                hour: "numeric",
                minute: "2-digit",
                timeZone: timezone
            }
        ).format(date);

    } catch {

        return isoTime
            .split("T")[1]
            ?.slice(0, 5) || "—";

    }

}


/* =====================================================
   FORMAT FORECAST DATE
   ===================================================== */

function formatForecastDate(
    dateString
) {

    const date =
        new Date(
            `${dateString}T12:00:00`
        );


    return new Intl.DateTimeFormat(
        "en",
        {
            weekday: "short"
        }
    ).format(date);

}


/* =====================================================
   CREATE FORECAST HTML
   ===================================================== */

function createForecastHTML(
    weather
) {

    if (
        !weather.daily ||
        !weather.daily.time
    ) {

        return "";

    }


    const daily =
        weather.daily;


    return daily.time
        .map((date, index) => {

            const weatherInfo =
                getWeatherInfo(
                    daily.weather_code[index]
                );


            const maxTemp =
                Math.round(
                    daily.temperature_2m_max[index]
                );


            const minTemp =
                Math.round(
                    daily.temperature_2m_min[index]
                );


            const precipitation =
                daily
                    .precipitation_probability_max[
                        index
                    ];


            return `

                <div class="forecast-day">

                    <div class="forecast-date">
                        ${formatForecastDate(
                            date
                        )}
                    </div>

                    <div
                        class="forecast-icon"
                        aria-label="${
                            weatherInfo.description
                        }"
                    >
                        ${weatherInfo.icon}
                    </div>

                    <div class="forecast-temp">
                        ${maxTemp}° /
                        ${minTemp}°
                    </div>

                    <div class="forecast-rain">
                        💧 ${precipitation ?? 0}%
                    </div>

                </div>

            `;

        })
        .join("");

}


/* =====================================================
   DISPLAY WEATHER CARDS
   ===================================================== */

function displayWeather(
    citiesToDisplay,
    weatherData
) {

    weatherContainer.innerHTML = "";


    citiesToDisplay.forEach(
        (city, index) => {

            const weather =
                weatherData[index];


            if (
                !weather ||
                !weather.current
            ) {

                return;

            }


            const current =
                weather.current;


            const currentWeather =
                getWeatherInfo(
                    current.weather_code
                );


            const timezone =
                weather.timezone ||
                "UTC";


            const localTime =
                formatLocalTime(
                    current.time,
                    timezone
                );


            const sunrise =
                weather.daily?.sunrise?.[0];


            const sunset =
                weather.daily?.sunset?.[0];


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "weather-card";


            card.innerHTML = `

                <div class="card-current">

                    <div class="card-header">

                        <div>

                            <h2 class="city-name">
                                ${escapeHTML(
                                    city.name
                                )}
                            </h2>

                            <p class="country-name">
                                ${escapeHTML(
                                    city.country
                                )}
                            </p>

                        </div>


                        <div
                            class="weather-icon"
                            aria-label="${
                                currentWeather.description
                            }"
                        >
                            ${currentWeather.icon}
                        </div>

                    </div>


                    <div class="current-main">

                        <div>

                            <p class="current-temperature">
                                ${Math.round(
                                    current.temperature_2m
                                )}°C
                            </p>

                            <p class="current-description">
                                ${
                                    currentWeather
                                        .description
                                }
                            </p>

                        </div>

                    </div>


                    <div class="weather-details">

                        <div class="detail">

                            <span class="detail-label">
                                Feels like
                            </span>

                            <span class="detail-value">
                                ${Math.round(
                                    current
                                        .apparent_temperature
                                )}°C
                            </span>

                        </div>


                        <div class="detail">

                            <span class="detail-label">
                                Humidity
                            </span>

                            <span class="detail-value">
                                ${
                                    current
                                        .relative_humidity_2m
                                }%
                            </span>

                        </div>


                        <div class="detail">

                            <span class="detail-label">
                                Wind
                            </span>

                            <span class="detail-value">
                                ${
                                    Math.round(
                                        current
                                            .wind_speed_10m
                                    )
                                } km/h
                            </span>

                        </div>


                        <div class="detail">

                            <span class="detail-label">
                                Local time
                            </span>

                            <span class="detail-value">
                                ${localTime}
                            </span>

                        </div>

                    </div>


                    <div class="sun-times">

                        <div class="sun-time">
                            🌅 Sunrise:
                            ${formatLocalTime(
                                sunrise,
                                timezone
                            )}
                        </div>

                        <div class="sun-time">
                            🌇 Sunset:
                            ${formatLocalTime(
                                sunset,
                                timezone
                            )}
                        </div>

                    </div>

                </div>


                <div class="forecast">

                    <p class="forecast-title">
                        7-Day Forecast
                    </p>

                    <div class="forecast-grid">

                        ${
                            createForecastHTML(
                                weather
                            )
                        }

                    </div>

                </div>

            `;


            weatherContainer.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   ESCAPE USER/DATA CONTENT
   ===================================================== */

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* =====================================================
   LOADING STATE
   ===================================================== */

function showLoading() {

    weatherContainer.innerHTML = `

        <div class="loading">

            🌍 Loading weather data
            for this page...

        </div>

    `;

}


/* =====================================================
   ERROR STATE
   ===================================================== */

function showApplicationError(
    message
) {

    weatherContainer.innerHTML = `

        <div class="error">

            <strong>
                ${escapeHTML(message)}
            </strong>

            <br>

            <button
                type="button"
                onclick="location.reload()"
            >
                Try again
            </button>

        </div>

    `;

}


/* =====================================================
   DISPLAY PAGE
   ===================================================== */

async function showPage(
    pageNumber
) {

    if (!cities.length) {

        return;

    }


    currentPage =
        Math.max(
            1,
            Math.min(
                pageNumber,
                totalPages
            )
        );


    const startIndex =
        (currentPage - 1) *
        ITEMS_PER_PAGE;


    const endIndex =
        startIndex +
        ITEMS_PER_PAGE;


    const citiesForPage =
        cities.slice(
            startIndex,
            endIndex
        );


    pageInfo.textContent =
        `Page ${currentPage} of ${totalPages}`;


    showLoading();


    /*
       Fetch only the ten cities
       currently visible.
    */

    try {

        const weatherData =
            await getWeatherForCities(
                citiesForPage
            );


        displayWeather(
            citiesForPage,
            weatherData
        );


        createPagination();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(error);

        showApplicationError(
            "Unable to retrieve weather data. Please try again."
        );

    }

}


/* =====================================================
   CREATE PAGINATION
   ===================================================== */

function createPagination() {

    pagination.innerHTML = "";


    /*
       Previous
    */

    const previousLi =
        document.createElement("li");


    const previous =
        document.createElement("a");


    previous.href = "#";

    previous.textContent = "«";

    previous.setAttribute(
        "aria-label",
        "Previous page"
    );


    if (currentPage === 1) {

        previous.classList.add(
            "disabled"
        );

    }


    previous.addEventListener(
        "click",
        event => {

            event.preventDefault();


            if (currentPage > 1) {

                showPage(
                    currentPage - 1
                );

            }

        }
    );


    previousLi.appendChild(
        previous
    );


    pagination.appendChild(
        previousLi
    );


    /*
       Page numbers
    */

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const li =
            document.createElement("li");


        const link =
            document.createElement("a");


        link.href = "#";

        link.textContent = page;


        link.setAttribute(
            "aria-label",
            `Page ${page}`
        );


        if (
            page === currentPage
        ) {

            link.classList.add(
                "active"
            );

            link.setAttribute(
                "aria-current",
                "page"
            );

        }


        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                showPage(page);

            }
        );


        li.appendChild(link);

        pagination.appendChild(li);

    }


    /*
       Next
    */

    const nextLi =
        document.createElement("li");


    const next =
        document.createElement("a");


    next.href = "#";

    next.textContent = "»";

    next.setAttribute(
        "aria-label",
        "Next page"
    );


    if (
        currentPage === totalPages
    ) {

        next.classList.add(
            "disabled"
        );

    }


    next.addEventListener(
        "click",
        event => {

            event.preventDefault();


            if (
                currentPage <
                totalPages
            ) {

                showPage(
                    currentPage + 1
                );

            }

        }
    );


    nextLi.appendChild(next);

    pagination.appendChild(nextLi);

}

/* =====================================================
   START APPLICATION
   ===================================================== */

loadCities();




