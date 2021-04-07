import { Transitions, Weather } from './types'

export const timePerWeather = 20 * 60 // 20 minutes
export const preproducedTransitions = 6 // preproduce 6 weathers at a time
export const overrideTime = 30 // 30 seconds to transition weather type

export const rainLevels: { [key in Weather]?: number } = {
  'RAIN': 0.25,
  'THUNDER': 0.25,
  'CLEARING': 0.1,
  'HALLOWEEN': 0.5
}

export const weathers: { [key in Weather]: boolean } = {
  'EXTRASUNNY': true,
  'CLEAR': true,
  'CLEARING': true,
  'OVERCAST': true,
  'SMOG': true,
  'FOGGY': true,
  'CLOUDS': true,
  'RAIN': true,
  'THUNDER': true,
  'SNOW': false,
  'BLIZZARD': false,
  'SNOWLIGHT': false,
  'XMAS': false,
  'HALLOWEEN': false,
}

// These are the MAXIMUM wind speeds, they are Math.random()'d on setting up a transition
export const windSpeeds: { [key in Weather]: number } = {
  'EXTRASUNNY': 0.5,
  'CLEAR': 1,
  'CLEARING': 4,
  'OVERCAST': 5,
  'SMOG': 2,
  'FOGGY': 4,
  'CLOUDS': 5,
  'RAIN': 8,
  'THUNDER': 12,
  'SNOW': 6,
  'BLIZZARD': 12,
  'SNOWLIGHT': 4,
  'XMAS': 6,
  'HALLOWEEN': 12
}

// this is in fahrenheit, because game is playing in Cali basically
export const temperatureRanges: { [key in Weather]: number[] } = {
  'EXTRASUNNY': [90, 110],
  'CLEAR': [80, 95],
  'CLEARING': [75, 85],
  'OVERCAST': [80, 80],
  'SMOG': [90, 95],
  'FOGGY': [80, 90],
  'CLOUDS': [80, 90],
  'RAIN': [75, 90],
  'THUNDER': [75, 90],
  'SNOW': [0, 32],
  'BLIZZARD': [-15, 10],
  'SNOWLIGHT': [0, 32],
  'XMAS': [-5, 15],
  'HALLOWEEN': [50, 80],
}

// this follows a weighting system
// MAKE SURE THIS IS SORTED FROM LOW TO HIGH
export const transitions: Transitions = {
  'EXTRASUNNY': [
    { to: 'CLEAR', chance: 50 },
    { to: 'OVERCAST', chance: 50 },
  ],
  'CLEAR': [
    { to: 'FOGGY', chance: 10 },
    { to: 'CLEAR', chance: 10 },
    { to: 'CLOUDS', chance: 25 },
    { to: 'SMOG', chance: 25 },
    { to: 'EXTRASUNNY', chance: 50 },
  ],
  'CLEARING': [
    { to: 'FOGGY', chance: 10 },
    { to: 'CLOUDS', chance: 25 },
    { to: 'SMOG', chance: 25 },
    { to: 'CLEAR', chance: 50 },
    { to: 'EXTRASUNNY', chance: 50 },
  ],
  'OVERCAST': [
    { to: 'RAIN', chance: 5 },
    { to: 'THUNDER', chance: 5 },
    { to: 'CLOUDS', chance: 25 },
    { to: 'SMOG', chance: 25 },
    { to: 'FOGGY', chance: 25 },
    { to: 'CLEAR', chance: 50 },
    { to: 'EXTRASUNNY', chance: 50 },
  ],
  'SMOG': [
    { to: 'CLEAR', chance: 100 },
  ],
  'FOGGY': [
    { to: 'RAIN', chance: 10 },
    { to: 'CLEAR', chance: 100 },
  ],
  'CLOUDS': [
    { to: 'RAIN', chance: 10 },
    { to: 'CLEARING', chance: 50 },
    { to: 'OVERCAST', chance: 50 },
  ],
  'RAIN': [
    { to: 'CLEARING', chance: 100 },
  ],
  'THUNDER': [
    { to: 'CLEARING', chance: 100 },
  ],
  'SNOW': [
    { to: 'CLEARING', chance: 5 },
    { to: 'OVERCAST', chance: 5 },
    { to: 'FOGGY', chance: 5 },
    { to: 'CLOUDS', chance: 5 },
    { to: 'XMAS', chance: 50 },
    { to: 'SNOWLIGHT', chance: 50 },
    { to: 'BLIZZARD', chance: 50 },
  ],
  'BLIZZARD': [
    { to: 'XMAS', chance: 50 },
    { to: 'SNOWLIGHT', chance: 50 },
  ],
  'SNOWLIGHT': [
    { to: 'SNOW', chance: 50 },
    { to: 'XMAS', chance: 50 },
  ],
  'XMAS': [
    { to: 'SNOW', chance: 50 },
    { to: 'SNOWLIGHT', chance: 50 },
    { to: 'BLIZZARD', chance: 50 },
  ],
  'HALLOWEEN': [
    { to: 'CLEARING', chance: 100 },
  ],
}

export const windDirections = {
  0: { short: "N", long: "North" },
  1: { short: "NE", long: "Northeast" },
  2: { short: "E", long: "East" },
  3: { short: "SE", long: "Southeast" },
  4: { short: "S", long: "South" },
  5: { short: "SW", long: "Southwest" },
  6: { short: "W", long: "West" },
  7: { short: "NW", long: "Northwest" }
}

// some computed weather properties
export const includesSnow = ['XMAS', 'SNOW', 'BLIZZARD', 'SNOWLIGHT']
export const includesRain = ['THUNDER', 'RAIN', 'HALLOWEEN', 'CLEARING']
export const activeWeathers = Object.keys(weathers).filter((weather: Weather) => weathers[weather]) as Weather[]
