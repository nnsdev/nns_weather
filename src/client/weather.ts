import { wait } from "./functions"
import { includesRain, includesSnow, overrideTime } from "../common/weather"
import { Weather, WeatherProgression } from "../common/types"

let weatherFrozen = false
let currentWeather = 'EXTRASUNNY'

setImmediate(() => {
  emitNet('nns_weather:client:weather:request')
})

const setWeather = async (weather: WeatherProgression, skipFreeze = false): Promise<void> => {
  if (weatherFrozen && !skipFreeze) {
    return
  }
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
    setWeather({
      weather: freezeAt,
      windDir: 0,
      windSpeed: 0,
      rainLevel: -1
    })
    return
  }
  if (!weatherFrozen) {
    emitNet('nns_weather:client:weather:request')
  }
})
