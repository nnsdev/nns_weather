import { wait } from "../functions"
import { includesRain, includesSnow, overrideTime, temperatureRanges, windDirections } from '../../common/weather';
import { Weather, WeatherProgression } from "../../common/types"
import { getRandomInt } from 'fivem-js';

let weatherFrozen = false
let currentWeather = 'EXTRASUNNY'

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
      includesRain.includes(currentWeather) ? `with Rain at ${Math.round(weather.rainLevel * 100)}%` : ''
    ]
  })
  if (currentWeather !== weather.weather) {
    SetWeatherTypeOvertimePersist(weather.weather, overrideTime)
    await wait(overrideTime * 1000)
    currentWeather = weather.weather
  }
  ClearOverrideWeather()
  ClearWeatherTypePersist()

  SetWeatherTypePersist(currentWeather)
  SetWeatherTypeNow(currentWeather)
  SetWeatherTypeNowPersist(currentWeather)
  SetForceVehicleTrails(includesSnow.includes(currentWeather))
  SetForcePedFootstepsTracks(includesSnow.includes(currentWeather))

  if (includesRain.includes(currentWeather)) {
    SetRainFxIntensity(weather.rainLevel)
  }

  SetWindSpeed(weather.windSpeed)
  SetWindDirection(weather.windDir)
}

onNet('nns_weather:client:weather', async (weather: WeatherProgression) => {
  setWeather(weather)
})

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
