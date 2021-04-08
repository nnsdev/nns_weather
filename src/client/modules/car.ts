import { WeatherProgression } from './../../common/types';
import { VEHICLE_TEMP_ENABLED, VEHICLE_CLEANING_ENABLED } from '../../common/config';
import { includesRain } from '../../common/weather';

let currentVehicle

on('baseevents:enteredVehicle', (vehicle: number, seat: number) => {
  currentVehicle = (seat === -1) ? vehicle : null
})

on('baseevents:leftVehicle', () => {
    currentVehicle = null
})


export const vehicleTemp = (currentWeather: WeatherProgression): void => {
  if (currentVehicle && VEHICLE_TEMP_ENABLED) {
    const currentTemperature = GetVehicleEngineTemperature(currentVehicle)
    if (currentTemperature < currentWeather.temperature) {
      SetVehicleEngineTemperature(currentVehicle, currentTemperature + (currentWeather.temperature - currentTemperature) / 100)
    }
  }
}

export const vehicleCleaning = (currentWeather: WeatherProgression): void => {
  if (currentVehicle && VEHICLE_CLEANING_ENABLED) {
    if (includesRain.includes(currentWeather.weather)) {
      const dirtLevel = GetVehicleDirtLevel(currentVehicle)
      if (dirtLevel > 0) {
        SetVehicleDirtLevel(currentVehicle, Math.max(0, dirtLevel - 1))
      }
    }
  }
}
