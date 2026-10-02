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

const SEARCH_RESULTS_LIMIT = 8;


/* =====================================================
   APPLICATION STATE
   ===================================================== */

let cities = [];

let filteredCities = [];

let currentPage = 1;

let totalPages = 0;

let isSearchMode = false;


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


const citySearch =
    document.getElementById(
        "city-search"
    );


const searchResults =
    document.getElementById(
        "search-results"
    );


const clearSearch =
    document.getElementById(
        "clear-search"
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
   GET WEATHER INFORMATION
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

    const response =
        await fetch(CITY_DATA_URL);


    if (!response.ok) {

        throw new Error(
            "Could not load cities.json"
        );

    }


    cities =
        await response.json();


    if (
        !Array.isArray(cities) ||
        cities.length === 0
    ) {

        throw new Error(
            "No valid cities found."
        );

    }


    /*
       Clean city names and countries.
    */

    for (const city of cities) {

        if (
            typeof city.name === "string"
        ) {

            city.name =
                city.name.trim();

        }


        if (
            typeof city.country === "string"
        ) {

            city.country =
                city.country.trim();

        }

    }


    /*
       Start with all cities.
    */

    filteredCities =
        cities;


    cityCount.textContent =
        cities.length.toLocaleString();


    totalPages =
        Math.ceil(
            filteredCities.length /
            ITEMS_PER_PAGE
        );


    console.log(
        "Total cities:",
        cities.length
    );


    console.log(
        "Total pages:",
        totalPages
    );


    createPagination();

    showPage(1);

}


/* =====================================================
   FETCH WEATHER FOR CITIES
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
   FORMAT LOCAL TIME
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

        return (
            isoTime
                .split("T")[1]
                ?.slice(0, 5) ||
            "—"
        );

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
        .map(
            (date, index) => {

                const weatherInfo =
                    getWeatherInfo(
                        daily.weather_code[index]
                    );


                const maxTemp =
                    Math.round(
                        daily.temperature_2m_max[
                            index
                        ]
                    );


                const minTemp =
                    Math.round(
                        daily.temperature_2m_min[
                            index
                        ]
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

            }
        )
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
   ESCAPE HTML
   ===================================================== */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

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
   SEARCH CITY DATABASE
   ===================================================== */

function searchCities(
    searchTerm
) {

    const term =
        searchTerm
            .trim()
            .toLowerCase();


    if (!term) {

        return [];

    }


    /*
       Search both city name and country.

       Examples:

       London

       Japan

       London United Kingdom
    */

    return cities
        .filter(city => {

            const cityName =
                String(
                    city.name || ""
                ).toLowerCase();


            const country =
                String(
                    city.country || ""
                ).toLowerCase();


            const countryCode =
                String(
                    city.countryCode || ""
                ).toLowerCase();


            const searchableText =
                `${cityName} ${country} ${countryCode}`;


            return searchableText.includes(
                term
            );

        })
        .sort(
            (a, b) => {

                const aName =
                    a.name
                        .toLowerCase();


                const bName =
                    b.name
                        .toLowerCase();


                /*
                   Exact city-name matches
                   appear first.
                */

                const aExact =
                    aName === term
                        ? 0
                        : 1;


                const bExact =
                    bName === term
                        ? 0
                        : 1;


                if (
                    aExact !== bExact
                ) {

                    return (
                        aExact -
                        bExact
                    );

                }


                /*
                   Larger cities appear
                   before smaller cities.
                */

                return (
                    (Number(b.population) || 0) -
                    (Number(a.population) || 0)
                );

            }
        );

}


/* =====================================================
   DISPLAY SEARCH SUGGESTIONS
   ===================================================== */

function displaySearchResults(
    results
) {

    searchResults.innerHTML = "";


    if (!results.length) {

        searchResults.innerHTML = `

            <div class="search-message">
                No cities found.
            </div>

        `;

        return;

    }


    const resultsToShow =
        results.slice(
            0,
            SEARCH_RESULTS_LIMIT
        );


    resultsToShow.forEach(
        city => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "search-result";


            button.setAttribute(
                "role",
                "option"
            );


            button.innerHTML = `

                <span class="search-result-city">
                    ${escapeHTML(
                        city.name
                    )}
                </span>

                <span class="search-result-country">
                    ${escapeHTML(
                        city.country
                    )}
                </span>

            `;


            button.addEventListener(
                "click",
                () => {

                    selectSearchResult(
                        city
                    );

                }
            );


            searchResults.appendChild(
                button
            );

        }
    );

}


/* =====================================================
   SELECT SEARCH RESULT
   ===================================================== */

function selectSearchResult(
    selectedCity
) {

    /*
       Put selected city name
       into the search box.
    */

    citySearch.value =
        selectedCity.name;


    clearSearch.hidden =
        false;


    /*
       Close suggestions.
    */

    searchResults.innerHTML = "";


    /*
       Show only the selected city.
    */

    filteredCities = [
        selectedCity
    ];


    isSearchMode = true;

    currentPage = 1;

    totalPages = 1;


    cityCount.textContent =
        "1";


    pageInfo.textContent =
        "Search result";


    pagination.innerHTML = "";


    showPage(
        1,
        false
    );


    /*
       Move the user to the weather card.
    */

    weatherContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =====================================================
   PERFORM SEARCH
   ===================================================== */

function performSearch() {

    const searchTerm =
        citySearch.value.trim();


    clearSearch.hidden =
        searchTerm.length === 0;


    /*
       Empty search = return
       to normal browsing.
    */

    if (!searchTerm) {

        isSearchMode = false;

        filteredCities =
            cities;


        currentPage = 1;


        totalPages =
            Math.ceil(
                filteredCities.length /
                ITEMS_PER_PAGE
            );


        cityCount.textContent =
            cities.length.toLocaleString();


        createPagination();

        searchResults.innerHTML = "";

        showPage(1);

        return;

    }


    const results =
        searchCities(
            searchTerm
        );


    displaySearchResults(
        results
    );


    /*
       The user can see matching
       city suggestions immediately.
    */

    if (!results.length) {

        isSearchMode = true;

        filteredCities = [];

        currentPage = 1;

        totalPages = 0;

        cityCount.textContent = "0";

        pageInfo.textContent =
            "No results";

        pagination.innerHTML = "";


        weatherContainer.innerHTML = `

            <div class="error">

                No cities matching
                "<strong>${escapeHTML(
                    searchTerm
                )}</strong>"
                were found.

            </div>

        `;

        return;

    }


    /*
       Pressing Enter without choosing
       a suggestion shows all matching
       cities, up to the normal page size.
    */

    isSearchMode = true;

    filteredCities =
        results;

    currentPage = 1;

    totalPages =
        Math.ceil(
            filteredCities.length /
            ITEMS_PER_PAGE
        );


    cityCount.textContent =
        results.length.toLocaleString();


    createPagination();

    showPage(1);

}


/* =====================================================
   CLEAR SEARCH
   ===================================================== */

function resetSearch() {

    citySearch.value = "";

    clearSearch.hidden = true;

    searchResults.innerHTML = "";

    isSearchMode = false;

    filteredCities =
        cities;

    currentPage = 1;

    totalPages =
        Math.ceil(
            cities.length /
            ITEMS_PER_PAGE
        );


    cityCount.textContent =
        cities.length.toLocaleString();


    createPagination();

    showPage(1);

    citySearch.focus();

}


/* =====================================================
   SEARCH EVENT LISTENERS
   ===================================================== */

citySearch.addEventListener(
    "input",
    () => {

        const value =
            citySearch.value.trim();


        clearSearch.hidden =
            value.length === 0;


        if (!value) {

            searchResults.innerHTML = "";

            return;

        }


        const results =
            searchCities(value);


        displaySearchResults(
            results
        );

    }
);


citySearch.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            performSearch();

        }


        if (
            event.key === "Escape"
        ) {

            searchResults.innerHTML = "";

        }

    }
);


clearSearch.addEventListener(
    "click",
    resetSearch
);


/* =====================================================
   CLICK OUTSIDE SEARCH
   ===================================================== */

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".search-box"
            )
        ) {

            searchResults.innerHTML = "";

        }

    }
);


/* =====================================================
   DISPLAY PAGE
   ===================================================== */

async function showPage(
    pageNumber,
    updatePagination = true
) {

    if (
        !filteredCities.length
    ) {

        return;

    }


    /*
       Calculate number of pages
       for the current dataset.
    */

    totalPages =
        Math.ceil(
            filteredCities.length /
            ITEMS_PER_PAGE
        );


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
        filteredCities.slice(
            startIndex,
            endIndex
        );


    if (isSearchMode) {

        pageInfo.textContent =
            `Search: ${currentPage} of ${totalPages}`;

    } else {

        pageInfo.textContent =
            `Page ${currentPage} of ${totalPages}`;

    }


    showLoading();


    try {

        /*
           Fetch only the cities
           currently visible.
        */

        const weatherData =
            await getWeatherForCities(
                citiesForPage
            );


        displayWeather(
            citiesForPage,
            weatherData
        );


        if (updatePagination) {

            createPagination();

        }


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


    if (
        totalPages <= 1
    ) {

        return;

    }


    /*
       Create a pagination button.
    */

    function createPageLink(
        page,
        text,
        className = ""
    ) {

        const li =
            document.createElement(
                "li"
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = "#";

        link.textContent = text;

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


        if (className) {

            link.classList.add(
                className
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
       Previous button.
    */

    const previousLi =
        document.createElement(
            "li"
        );


    const previous =
        document.createElement(
            "a"
        );


    previous.href = "#";

    previous.textContent = "«";

    previous.setAttribute(
        "aria-label",
        "Previous page"
    );


    if (
        currentPage === 1
    ) {

        previous.classList.add(
            "disabled"
        );

    }


    previous.addEventListener(
        "click",
        event => {

            event.preventDefault();


            if (
                currentPage > 1
            ) {

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
       Determine which page numbers
       should be visible.

       This prevents thousands of
       buttons from being created.
    */

    const pages = new Set();


    pages.add(1);

    pages.add(totalPages);


    for (
        let page =
            currentPage - 2;
        page <=
            currentPage + 2;
        page++
    ) {

        if (
            page >= 1 &&
            page <= totalPages
        ) {

            pages.add(page);

        }

    }


    const sortedPages =
        [...pages].sort(
            (a, b) => a - b
        );


    let previousPage = null;


    sortedPages.forEach(
        page => {

            /*
               Add ellipsis where
               pages are skipped.
            */

            if (
                previousPage !== null &&
                page - previousPage > 1
            ) {

                const ellipsisLi =
                    document.createElement(
                        "li"
                    );


                const ellipsis =
                    document.createElement(
                        "span"
                    );


                ellipsis.className =
                    "ellipsis";


                ellipsis.textContent =
                    "...";


                ellipsisLi.appendChild(
                    ellipsis
                );


                pagination.appendChild(
                    ellipsisLi
                );

            }


            createPageLink(
                page,
                page
            );


            previousPage = page;

        }
    );


    /*
       Next button.
    */

    const nextLi =
        document.createElement(
            "li"
        );


    const next =
        document.createElement(
            "a"
        );


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


    nextLi.appendChild(
        next
    );


    pagination.appendChild(
        nextLi
    );

}


/* =====================================================
   START APPLICATION
   ===================================================== */

loadCities()
    .catch(error => {

        console.error(error);

        showApplicationError(
            error.message ||
            "Unable to load the application."
        );

    });

