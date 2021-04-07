export type Weather = 'EXTRASUNNY' | 'CLEAR' | 'CLEARING' | 'OVERCAST' | 'SMOG' | 'FOGGY' | 'CLOUDS' | 'RAIN' | 'THUNDER' | 'SNOW' | 'BLIZZARD' | 'SNOWLIGHT' | 'XMAS' | 'HALLOWEEN'

export interface Transition {
  to: Weather
  chance: number
}

export interface Transitions {
  [key: string]: Transition[]
}

export interface WeatherProgression {
  weather: Weather
  windSpeed: number
  windDir: number
  rainLevel: number
  temperature: number
}
