import { weightedElement, randomArrElement } from "./helpers"
import { activeWeathers, preproducedTransitions, rainLevels, timePerWeather, transitions, windSpeeds } from "../common/weather"
import { Weather, WeatherProgression } from '../common/types'

let weatherProgression:WeatherProgression[] = []

setImmediate(async () => {
  for (let i=0; i<preproducedTransitions; i++) {
    await setNextProgression()
  }
})

const setNextProgression = (): void => {
  const lastWeather = weatherProgression[weatherProgression.length - 1]
  if (!lastWeather) {
    const firstElement = randomArrElement(activeWeathers)
    weatherProgression.push({
      weather: firstElement,
      windSpeed: Math.random() * windSpeeds[firstElement],
      windDir: Math.random() * 7,
      rainLevel: rainLevels[firstElement] ?? 0
    })
  } else {
    const transition = getNextTransition(lastWeather.weather)
    weatherProgression.push({
      weather: transition,
      windSpeed: Math.random() * windSpeeds[transition],
      windDir: Math.random() * 7,
      rainLevel: rainLevels[transition] ?? 0
    })
  }
}

const getNextTransition = (weather: Weather): Weather => {
  const weatherTransitions = transitions[weather]

  const nextTransition = weightedElement(weatherTransitions)

  if (!activeWeathers.includes(nextTransition.to)) {
    return getNextTransition(weather)
  }
  return nextTransition.to
}

onNet('nns_weather:client:weather:request', () => {
  emitNet('nns_weather:client:weather', global.source, weatherProgression[0])
})

setInterval(() => {
  weatherProgression.shift()

  setNextProgression()

  const currentWeather = weatherProgression[0]

  emitNet('nns_weather:client:weather', -1, currentWeather)
}, timePerWeather * 1000)

RegisterCommand('weather', (source: string, args: string[]) => {
  if (!IsPlayerAceAllowed(source, "nns_weather.commands.weather")) {
    return emitNet('SendAlertError', source, 'You do not have permissions to use this command.')
  }

  if (args.length === 0) {
    return emitNet('SendAlertError', source, 'Format: /weather [type]')
  }

  const weather = args[0] as Weather
  if (!activeWeathers.includes(weather)) {
    return emitNet('SendAlertError', source, 'Format: /weather [type]')
  }

  weatherProgression = [{
    weather,
    windSpeed: Math.random() * windSpeeds[weather],
    windDir: Math.random() * 7,
    rainLevel: rainLevels[weather] ?? 0
  }]
  for (let i=0; i<preproducedTransitions-1; i++) {
    setNextProgression()
  }

  emitNet('nns_weather:client:weather', -1, weather)
}, false)

global.exports('currentWeather', () => {
  return weatherProgression[0]
})
global.exports('getProgression', () => {
  return weatherProgression
})
