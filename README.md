# World-Weather by KAFE README

A Global City Weather Dashboard

PROJECT OVERVIEW
----------------
World-Weather by KAFE is a responsive web application that provides current weather conditions and 7-day forecasts for cities around the world.

The application lets users browse a worldwide city database, search for specific cities, distinguish cities with the same name, and view live weather information based on each city's geographic coordinates. 

The project is built with plain HTML, CSS, and JavaScript and is available on (https://kanamkafe.org/world-weather).


KEY FEATURES
------------

1. GLOBAL CITY DATABASE
   - Uses a large JSON dataset containing cities from around the world.
   - City records include information such as city name, country, country code, latitude, longitude, and population.
   - The application is designed for a worldwide city database rather than a small fixed list of cities.

2. CITY SEARCH
   - Dedicated search box for finding cities quickly.
   - Searches city names and country information.
   - Multiple cities with the same name can appear as separate results.
   - Example:
       London, United Kingdom
       London, Canada
       London, United States
       London, Kiribati
   - Clicking a result loads weather for that city.
   - A clear button restores the full city list.

3. CURRENT WEATHER
   Weather cards display information including:
   - Current temperature
   - Weather condition
   - Feels-like temperature
   - Relative humidity
   - Wind speed
   - Local time
   - Sunrise
   - Sunset

4. 7-DAY FORECAST
   - Provides a seven-day forecast for each selected city.
   - Forecast information is retrieved dynamically from Open-Meteo.

5. PAGINATION
   - Cities are displayed in manageable groups.
   - The current application displays 10 cities per page.
   - Compact pagination keeps navigation practical even with thousands of cities.

6. RESPONSIVE DESIGN
   - Designed for desktop, tablet, and mobile screens.
   - Weather cards use a responsive grid.
   - Smaller screens automatically switch to a single-column layout.

7. BATCHED WEATHER REQUESTS
   - Weather data is retrieved from Open-Meteo.
   - Visible cities can be requested together, reducing unnecessary individual API requests.

8. NO API KEY REQUIRED
   - The application uses the free Open-Meteo weather service.
   - No personal weather API key is required for the application.


TECHNOLOGY STACK
----------------

FRONT END
- HTML5
- CSS3
- Vanilla JavaScript

WEATHER SERVICE
- Open-Meteo Forecast API

CITY DATABASE
- Local JSON file: cities.json

HOSTING
- https://kanamkafe.org/world-weather

SOURCE CONTROL
- Git / GitHub


PROJECT STRUCTURE
-----------------

world-weather/
|
|-- index.html
|     Main application page and user interface.
|
|-- styles.css
|     Visual styling, responsive layout, weather cards, search interface, pagination, and footer.
|
|-- script.js
|     Application logic, including city loading, searching, pagination, weather requests, rendering, and user interaction.
|
|-- cities.json
      Worldwide city information used by the application.


HOW THE APPLICATION WORKS
-------------------------

1. The browser loads index.html.
2. script.js loads cities.json.
3. The city database is kept in memory for fast searching and pagination.
4. Cities are displayed in pages.
5. JavaScript sends the coordinates of visible cities to Open-Meteo.
6. Open-Meteo returns current weather and forecast data.
7. JavaScript converts the response into weather cards.
8. Typing in the search box filters the loaded city database.
9. Selecting a result loads weather for that city.
10. Clearing the search restores the worldwide city list.


SEARCH BEHAVIOR
---------------

The search system is designed to handle duplicate city names.

For example, searching for "London" can return several cities with the same name but different countries.

Search results prioritize exact city-name matches and can use population information when ordering matching cities.

The search is performed in the browser after cities.json has been loaded.


WEATHER DATA
------------

The application uses the Open-Meteo Forecast API.

Weather requests are based on each city's latitude and longitude. The application uses the service for current conditions and daily forecast information, including temperature, apparent temperature, humidity, wind, sunrise, sunset, and local time.


CITY DATA
---------

The cities.json file is the application's worldwide city database.

A city record can use a structure such as:

{
  "name": "Tokyo",
  "country": "Japan",
  "countryCode": "JP",
  "latitude": 35.6762,
  "longitude": 139.6503,
  "population": 14000000
}

The exact number of cities available depends on the current cities.json dataset.


USER EXPERIENCE
---------------

The main workflow is:

    Open World-Weather by KAFE
          |
          v
    Browse worldwide cities
          |
          +--------------------+
          |                    |
          v                    v
     Change page          Search for a city
                               |
                               v
                       Select search result
                               |
                               v
                       View current weather
                               |
                               v
                       View 7-day forecast


DESIGN
------

The interface includes:
- Global Weather header
- City database counter
- Pagination information
- City search box
- Search results
- Weather cards
- Current weather details
- Seven-day forecast
- Sunrise and sunset information
- Responsive layout
- Footer with data-service information


DEPLOYMENT
----------

World-Weather by KAFE is available on (https://kanamkafe.org/world-weather).

The project can be maintained through Git and GitHub. After changes are committed and pushed to the connected repository, https://kanamkafe.org/world-weather can then render the updated application.

The application does not require a traditional server-side backend for its core functionality. The browser loads the application files and requests weather data from Open-Meteo.


IMPORTANT FILES
---------------

index.html
    Defines the structure of the user interface.

styles.css
    Defines the visual appearance and responsive behavior.

script.js
    Controls application functionality and interaction.

cities.json
    Contains the city database used for searching, pagination, and weather
    lookups.


MAINTENANCE NOTES
-----------------

When updating cities.json:
- Keep the file valid JSON.
- Preserve latitude and longitude because they are required for weather lookups.
- Keep city and country information consistent.
- Make sure country codes and country names are handled consistently.

When changing script.js:
- Test city search.
- Test duplicate city names.
- Test pagination.
- Test weather loading.
- Test the 7-day forecast.
- Test error handling.

When rendering:
- Save all changes.
- Commit changes to Git.
- Push changes to GitHub.
- Confirm the https://kanamkafe.org/world-weather rendering succeeds.
- Test the live application, especially search, city selection, weather, and pagination.


PROJECT GOAL
------------

World-Weather by KAFE is intended to be a practical global weather explorer rather than a weather application limited to one country or a short list of cities.

Its main goals are to make it easy for users to:
- Discover cities around the world
- Search for a specific city
- Distinguish cities that share the same name
- View current weather conditions
- Check the next seven days of weather
- Use the application from any modern web browser


PROJECT SUMMARY
---------------

World-Weather by KAFE combines a worldwide city database, browser-based search, responsive design, and live weather information from Open-Meteo into one simple web application.

The project intentionally uses standard web technologies: HTML, CSS, and JavaScript. This keeps the application lightweight, understandable, maintainable, and straightforward to render on https://kanamkafe.org/world-weather.

# COPYRIGHT NOTICE

© 2026 Moses Ochieng Akuno / KAFE. All rights reserved.

World-Weather by KAFE, including its original source code, original artwork, logo, branding, website content, documentation, and original design elements, is protected by applicable copyright and other intellectual-property laws.

The source code is publicly available on GitHub for viewing and reference. No license is granted to reproduce, distribute, modify, republish, or commercially exploit the original World-Weather source code or original creative materials, except where expressly permitted by the copyright owner or by applicable third-party licenses.

Third-party data and services used by the application remain subject to their respective licenses and terms of use.

## Third-Party Data Attribution

### GeoNames

The city and geographical data used by this application is based in part
on data from GeoNames.

GeoNames data is licensed under the Creative Commons Attribution 4.0
International License (CC BY 4.0).

Source:
https://www.geonames.org/

The GeoNames data is provided "as is" without warranty regarding accuracy, timeliness, or completeness.

## Weather Data Attribution

Weather data is provided by Open-Meteo.

Open-Meteo weather data is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).

Source:

https://open-meteo.com/

The Open-Meteo free API is intended for non-commercial use. Commercial use is subject to Open-Meteo's applicable commercial
API licensing and subscription terms.

Weather data attribution is provided in accordance with the applicable Open-Meteo and underlying data-source licensing
requirements.

END of World-Weather by KAFE README.