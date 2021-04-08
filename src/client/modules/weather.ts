import { wait } from "../functions"
import { includesRain, includesSnow, overrideTime, temperatureRanges, windDirections } from '../../common/weather';
import { Weather, WeatherProgression } from "../../common/types"
import { getRandomInt } from 'fivem-js';
import { vehicleTemp, vehicleCleaning } from './car';

let weatherFrozen = false

export let currentWeather: WeatherProgression = {
  weather: 'EXTRASUNNY',
  windSpeed: 0,
  windDir: 0,
  rainLevel: 0,
  temperature: 0
}

setImmediate(() => {
  emitNet('nns_weather:client:weather:request')
})

const setWeather = async (weather: WeatherProgression, skipFreeze = false): Promise<void> => {
  if (weatherFrozen && !skipFreeze) {
    return
  }
  emit('chat:addMessage', {
    template: '<div class="chat-message"><b>WEATHER REPORT</b><br> {0} at {1}°F <br>{2}mph {3} {4}</div>',
    args: [
      weather.weather,
      weather.temperature,
      (weather.windSpeed * 2.236936).toFixed(2),
      windDirections[Math.round(weather.windDir)].long,
      includesRain.includes(currentWeather.weather) ? `with Rain at ${Math.round(weather.rainLevel * 100)}%` : ''
    ]
  })
  if (currentWeather.weather !== weather.weather) {
    SetWeatherTypeOvertimePersist(weather.weather, overrideTime)
    await wait(overrideTime * 1000)
    currentWeather = weather
  }
  ClearOverrideWeather()
  ClearWeatherTypePersist()

  SetWeatherTypePersist(currentWeather.weather)
  SetWeatherTypeNow(currentWeather.weather)
  SetWeatherTypeNowPersist(currentWeather.weather)
  SetForceVehicleTrails(includesSnow.includes(currentWeather.weather))
  SetForcePedFootstepsTracks(includesSnow.includes(currentWeather.weather))

  if (includesRain.includes(currentWeather.weather)) {
    SetRainFxIntensity(weather.rainLevel)
  }

  SetWindSpeed(weather.windSpeed)
  SetWindDirection(weather.windDir)
}

onNet('nns_weather:client:weather', async (weather: WeatherProgression) => {
  setWeather(weather)
})

setInterval(() => {
  vehicleCleaning(currentWeather)
  vehicleTemp(currentWeather)
}, 30000)

global.exports('FreezeWeather', (freeze: boolean, freezeAt?: Weather) => {
  weatherFrozen = freeze
  if (weatherFrozen && freezeAt) {
    const temperature = temperatureRanges[freezeAt] ?? [80, 100]
    setWeather({
      weather: freezeAt,
      windDir: 0,
      windSpeed: 0,
      rainLevel: -1,
      temperature: getRandomInt(temperature[0], temperature[1])
    })
    return
  }
  if (!weatherFrozen) {
    emitNet('nns_weather:client:weather:request')
  }
})
