import { secondsPerDay, secondsPerMinute } from "../../common/time"

let time = 0

// makes sure time is consistent by real time on script start
setImmediate(() => {
  const date = new Date()
  const seconds = (date.getUTCHours() * 3600 + date.getUTCMinutes() * 60 + date.getUTCSeconds()) % secondsPerDay

  const progression = seconds / secondsPerDay

  time = Math.floor(progression * (24*60))

  emitNet('nns_weather:client:time', -1, time)
})

setInterval(() => {
  time++
  if (time >= 24*60) {
    time = 0
  }
}, secondsPerMinute * 1000)

RegisterCommand('time', (source: string, args: string[]) => {
  if (!IsPlayerAceAllowed(source, "nns_weather.commands.time")) {
    return emitNet('SendAlertError', source, 'You do not have permissions to use this command.')
  }

  if (args.length === 0) {
    return emitNet('SendAlertError', source, 'Format: /time [0-1440]')
  }

  const _time = parseInt(args[0])

  if (_time < 0 || _time > 1440) {
    return emitNet('SendAlertError', source, 'Format: /time [0-1440]')
  }

  time = _time
  emitNet('nns_weather:client:time', -1, time)
  emitNet('SendAlertSuccess', source, 'Time changed')
}, false)

onNet('nns_weather:client:time:request', () => {
  emitNet('nns_weather:client:time', global.source, time)
})

export const currentTime = (): number => {
  return time
}
export const currentHour = (): number => {
  return Math.floor(time / 60)
}
export const currentMinute = (): number => {
  return time % 60
}
export const currentTimeFormatted = ():string => {
  return `${currentHour().toString().padStart(2, "0")}:${currentMinute().toString().padStart(2, "0")}`
}

global.exports('currentTime', currentTime)
global.exports('currentHour', currentHour)
global.exports('currentMinute', currentMinute)
global.exports('currentTimeFormatted', currentTimeFormatted)
