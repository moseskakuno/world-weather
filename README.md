# World-weather README

WORLD WEATHER README
====================

A Global City Weather Dashboard

PROJECT OVERVIEW
----------------
World Weather is a responsive web application that provides current weather
conditions and 7-day forecasts for cities around the world.

The application lets users browse a worldwide city database, search for
specific cities, distinguish cities with the same name, and view live weather
information based on each city's geographic coordinates.

The project is built with plain HTML, CSS, and JavaScript and is available on
(https://kanamkafe.org/world-weather/).


KEY FEATURES
------------

1. GLOBAL CITY DATABASE
   - Uses a large JSON dataset containing cities from around the world.
   - City records include information such as city name, country, country
     code, latitude, longitude, and population.
   - The application is designed for a worldwide city database rather than
     a small fixed list of cities.

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
   - Compact pagination keeps navigation practical even with thousands of
     cities.

6. RESPONSIVE DESIGN
   - Designed for desktop, tablet, and mobile screens.
   - Weather cards use a responsive grid.
   - Smaller screens automatically switch to a single-column layout.

7. BATCHED WEATHER REQUESTS
   - Weather data is retrieved from Open-Meteo.
   - Visible cities can be requested together, reducing unnecessary
     individual API requests.

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
- https://kanamkafe.org/world-weather/

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
|     Visual styling, responsive layout, weather cards, search interface,
|     pagination, and footer.
|
|-- script.js
|     Application logic, including city loading, searching, pagination,
|     weather requests, rendering, and user interaction.
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

For example, searching for "London" can return several cities with the same
name but different countries.

Search results prioritize exact city-name matches and can use population
information when ordering matching cities.

The search is performed in the browser after cities.json has been loaded.


WEATHER DATA
------------

The application uses the Open-Meteo Forecast API.

Weather requests are based on each city's latitude and longitude. The
application uses the service for current conditions and daily forecast
information, including temperature, apparent temperature, humidity, wind,
sunrise, sunset, and local time.


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

The exact number of cities available depends on the current cities.json
dataset.


USER EXPERIENCE
---------------

The main workflow is:

    Open World Weather
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

World Weather is available on (https://kanamkafe.org/world-weather/).

The project can be maintained through Git and GitHub. After changes are
committed and pushed to the connected repository, https://kanamkafe.org/world-weather/ can then render the
updated application.

The application does not require a traditional server-side backend for its
core functionality. The browser loads the application files and requests
weather data from Open-Meteo.


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
- Preserve latitude and longitude because they are required for weather
  lookups.
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
- Confirm the https://kanamkafe.org/world-weather/ rendering succeeds.
- Test the live application, especially search, city selection, weather,
  and pagination.


PROJECT GOAL
------------

World Weather is intended to be a practical global weather explorer rather
than a weather application limited to one country or a short list of cities.

Its main goals are to make it easy for users to:
- Discover cities around the world
- Search for a specific city
- Distinguish cities that share the same name
- View current weather conditions
- Check the next seven days of weather
- Use the application from any modern web browser


PROJECT SUMMARY
---------------

World Weather combines a worldwide city database, browser-based search,
responsive design, and live weather information from Open-Meteo into one
simple web application.

The project intentionally uses standard web technologies: HTML, CSS, and
JavaScript. This keeps the application lightweight, understandable,
maintainable, and straightforward to render on https://kanamkafe.org/world-weather/.


END OF WORLD WEATHER README
===========================


============================================
README for GeoNames Gazetteer extract files:

===========================================

This work is licensed under a Creative Commons Attribution 4.0 License,
see https://creativecommons.org/licenses/by/4.0/
The Data is provided "as is" without warranty or any representation of accuracy, timeliness or completeness.

The data format is tab-delimited text in utf8 encoding.


Files :
-------
XX.zip                   : features for country with iso code XX, see 'geoname' table for columns. 'no-country' for features not belonging to a country.
allCountries.zip         : all countries combined in one file, see 'geoname' table for columns
cities500.zip            : all cities with a population > 500 or seats of adm div down to PPLA4 (ca 185.000), see 'geoname' table for columns
cities1000.zip           : all cities with a population > 1000 or seats of adm div down to PPLA3 (ca 130.000), see 'geoname' table for columns
cities5000.zip           : all cities with a population > 5000 or PPLA (ca 50.000), see 'geoname' table for columns
cities15000.zip          : all cities with a population > 15000 or capitals (ca 25.000), see 'geoname' table for columns
alternateNamesV2.zip     : alternate names with language codes and geonameId, file with iso language codes, with new columns from and to
alternateNames.zip       : obsolete use V2, this file does not have the new columns to and from and will be removed in the future
admin1CodesASCII.txt     : names in English for admin divisions. Columns: code, name, name ascii, geonameid
admin2Codes.txt          : names for administrative subdivision 'admin2 code' (UTF8), Format : concatenated codes <tab>name <tab> asciiname <tab> geonameId
iso-languagecodes.txt    : iso 639 language codes, as used for alternate names in file alternateNames.zip
featureCodes.txt         : name and description for feature classes and feature codes 
timeZones.txt            : countryCode, timezoneId, gmt offset on 1st of January, dst offset to gmt on 1st of July (of the current year), rawOffset without DST
countryInfo.txt          : country information : iso codes, fips codes, languages, capital ,...
                           see the geonames webservices for additional country information,
                                bounding box                         : http://api.geonames.org/countryInfo?
                                country names in different languages : http:/api.geonames.org/countryInfoCSV?lang=it
modifications-<date>.txt : all records modified on the previous day, the date is in yyyy-MM-dd format. You can use this file to daily synchronize your own geonames database.
deletes-<date>.txt       : all records deleted on the previous day, format : geonameId <tab> name <tab> comment.

alternateNamesModifications-<date>.txt : all alternate names modified on the previous day,
alternateNamesDeletes-<date>.txt       : all alternate names deleted on the previous day, format : alternateNameId <tab> geonameId <tab> name <tab> comment.
userTags.zip		: user tags , format : geonameId <tab> tag.
hierarchy.zip		: parentId, childId, type. The type 'ADM' stands for the admin hierarchy modeled by the admin1-4 codes. The other entries are entered with the user interface. The relation toponym-adm hierarchy is not included in the file, it can instead be built from the admincodes of the toponym.
adminCode5.zip		: the new adm5 column is not yet exported in the other files (in order to not break import scripts). Instead it is availabe as separate file.
			  columns: geonameId,adm5code

The main 'geoname' table has the following fields :
---------------------------------------------------
geonameid         : integer id of record in geonames database
name              : name of geographical point (utf8) varchar(200)
asciiname         : name of geographical point in plain ascii characters, varchar(200)
alternatenames    : alternatenames, comma separated, ascii names automatically transliterated, convenience attribute from alternatename table, varchar(10000)
latitude          : latitude in decimal degrees (wgs84)
longitude         : longitude in decimal degrees (wgs84)
feature class     : see http://www.geonames.org/export/codes.html, char(1)
feature code      : see http://www.geonames.org/export/codes.html, varchar(10)
country code      : ISO-3166 2-letter country code, 2 characters
cc2               : alternate country codes, comma separated, ISO-3166 2-letter country code, 200 characters
admin1 code       : fipscode (subject to change to iso code), see exceptions below, see file admin1Codes.txt for display names of this code; varchar(20)
admin2 code       : code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80) 
admin3 code       : code for third level administrative division, varchar(20)
admin4 code       : code for fourth level administrative division, varchar(20)
population        : bigint (8 byte int) 
elevation         : in meters, integer
dem               : digital elevation model, srtm3 or gtopo30, average elevation of 3''x3'' (ca 90mx90m) or 30''x30'' (ca 900mx900m) area in meters, integer. srtm processed by cgiar/ciat.
timezone          : the iana timezone id (see file timeZone.txt) varchar(40)
modification date : date of last modification in yyyy-MM-dd format


AdminCodes:
Most adm1 are FIPS codes. ISO codes are used for US, CH, BE and ME. UK and Greece are using an additional level between country and fips code. The code '00' stands for general features where no specific adm1 code is defined.
The corresponding admin feature is found with the same countrycode and adminX codes and the respective feature code ADMx.



The table 'alternate names' :
-----------------------------
alternateNameId   : the id of this alternate name, int
geonameid         : geonameId referring to id in table 'geoname', int
isolanguage       : iso 639 language code 2- or 3-characters, optionally followed by a hyphen and a countrycode for country specific variants (ex:zh-CN) or by a variant name (ex: zh-Hant); 4-characters 'post' for postal codes and 'iata','icao' and faac for airport codes, fr_1793 for French Revolution names,  abbr for abbreviation, link to a website (mostly to wikipedia), wkdt for the wikidataid, varchar(7)
alternate name    : alternate name or name variant, varchar(400)
isPreferredName   : '1', if this alternate name is an official/preferred name
isShortName       : '1', if this is a short name like 'California' for 'State of California'
isColloquial      : '1', if this alternate name is a colloquial or slang term. Example: 'Big Apple' for 'New York'.
isHistoric        : '1', if this alternate name is historic and was used in the past. Example 'Bombay' for 'Mumbai'.
from		  : from period when the name was used
to		  : to period when the name was used

Remark : the field 'alternatenames' in the table 'geoname' is a short version of the 'alternatenames' table without links and postal codes but with ascii transliterations. You probably don't need both. 
If you don't need to know the language of a name variant, the field 'alternatenames' will be sufficient. If you need to know the language
of a name variant, then you will need to load the table 'alternatenames' and you can drop the column in the geoname table.




Boundaries:
Simplified country boundaries are available in two slightly different formats:
shapes_simplified_low:
geonameId: 	The geonameId of the feature
geoJson:	The boundary in geoJson format

shapes_simplified_low.json:
similar to the abovementioned file, but fully in geojson format. The geonameId is a feature property in the geojson string.


Statistics on the number of features per country and the feature class and code distributions : http://www.geonames.org/statistics/ 


Continent codes :
AF : Africa			geonameId=6255146
AS : Asia			geonameId=6255147
EU : Europe			geonameId=6255148
NA : North America		geonameId=6255149
OC : Oceania			geonameId=6255151
SA : South America		geonameId=6255150
AN : Antarctica			geonameId=6255152


feature classes:
A: country, state, region,...
H: stream, lake, ...
L: parks,area, ...
P: city, village,...
R: road, railroad 
S: spot, building, farm
T: mountain,hill,rock,... 
U: undersea
V: forest,heath,...


If you find errors or miss important places, please do use the wiki-style edit interface on our website 
https://www.geonames.org to correct inaccuracies and to add new records. 
Thanks in the name of the geonames community for your valuable contribution.

Data Sources:
https://www.geonames.org/datasources/


More Information is also available in the geonames faq :

https://forum.geonames.org/gforum/forums/show/6.page

The forum : https://forum.geonames.org

or the google group : https://groups.google.com/group/geonames

===================================================
END OF README for GeoNames Gazetteer extract files:

===================================================