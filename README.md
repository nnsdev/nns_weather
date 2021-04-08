# nns_weather

Full weather and time sync in TypeScript, includes weather transitions as well as rain level and wind speed. Also includes ability to freeze time and weather over exports and random temperatures based on weather type.

# Install

- Download this repo or clone it
- cd into the folder
- `npm i`
- `npm run build`
- add ace permissions for admin commands (see down below)
- start resource
- profit

**Be advised, client errors use the events `SendAlertError` and `SendAlertSuccess`, you might want to change them to match whatever notification library you are using.**

## Time
- Time is based on the current UTC time as a base, the default setting is 2 a day. If it is 01:00am UTC, ingame time will be 12:00

**Config options:** `(src/common/time.ts)`

- `hoursPerDay` Default 2, means one ingame day is 2 irl hours

## Weather
Weather initializes as EXTRASUNNY

**Config options:** `(src/common/weather.ts)`

- `timePerWeather` Default 20 (minutes), time in minutes how long a weather type will take until it transitions to a new type
- `preproducedTransitions` Default 6, serverside keeps an array of upcoming weathers with their information (rain level, wind speed and dir) for potential use in a weather app
- `overrideTime` Default 30 (seconds), time in seconds to transition from the old to the new weather time
- `rainLevels` Keeps weather type definitions and how much it rains in those, further info in this [native](https://runtime.fivem.net/doc/natives/?_0x643E26EA6E024D92)
- `weathers` Keeps all weathers in the list and if they are enabled or disabled. Set `true` if you want it, `false` to disable them.
- `windSpeeds` Sets the *maximum* wind speed a weather type can reach, this does not have a top limit
- ´temperatureRanges` Sets the min and max temperature ranges for each weather. **These are only artificial, GTA does not have temperature related natives**
- `transitions` Contains a list of all types, and to what weather they can transition to with a "weight", **this needs to be sorted from low to high**, the higher the chance in comparison to the other values in the array, the more likely it is going to be picked.

**Vehicle related config options:** `(src/common/config.ts)`

- `VEHICLE_TEMP_ENABLED` vehicle engine temperature will increase based on the artificial temperature, unsure if this has any effects on the car
- `VEHICLE_CLEANING_ENABLED` vehicle is cleaning itself in rainy weather (reduces vehicle dirt level)


## Client Exports

`exports['nns_weather']:FreezeTime(freeze, freezeAt?)`:
- `freeze` boolean to freeze/unfreeze. Time will be rerequested on disable
- `freezeAt` time to freeze it to when freezing, optional

`exports['nns_weather']:FreezeWeather(freeze, freezeAt?)`:
- `freeze` boolean to freeze/unfreeze. Weather will be rerequested on disable
- `freezeAt` weather to freeze it to when freezing, optional. Will set wind to 0 and rain to default.

## Server Exports
`exports['nns_weather']:currentWeather()`
- Gets the current weather type with rain and wind information

`exports['nns_weather']:getProgression()`
- Gives the full weather progression back

`exports['nns_weather']:currentTime()`
- Gets the current raw time (0-1339)

`exports['nns_weather']:currentHour()`
- Gets the current hour (0-23), helpful for making time-based checks

`exports['nns_weather']:currentMinute()`
- Gets the current minute (0-59), for completionists sake

`exports['nns_weather']:currentTimeFormatted()`
- Gets the current time formatted as `hh:mm`

## Commands
`/time [0-1339]`
- Sets the current ingame time, gets synced to all players, 0 would be midnight

`/weather [WEATHER TYPES]`
- Sets the current weather, randomizes the other properties, resets the progression to match the new current weather

## Ace Permissions
`nns_weather.commands.weather` Needed to use /weather

`nns_weather.commands.time` Needed to use /time
