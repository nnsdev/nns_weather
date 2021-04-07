import { secondsPerMinute } from "../../common/time"

let timeFrozen = false
let currentTime = 0

setImmediate(() => {
  emitNet('nns_weather:client:time:request')
})

onNet('nns_weather:client:time', (time: number) => {
  if (timeFrozen) {
    return
  }
  currentTime = time
})

setInterval(() => {
  if (!timeFrozen) {
    currentTime++
    if (currentTime >= 1440) {
      currentTime = 0
    }

    setIngameTime()
  }
}, secondsPerMinute * 1000)

const setIngameTime = (): void => {
  const hour = Math.floor(currentTime / 60)
  const minute = currentTime % 60

  NetworkOverrideClockTime(hour, minute, 0)
}

global.exports('FreezeTime', (freeze: boolean, freezeAt?: number) => {
  timeFrozen = freeze
  if (timeFrozen && freezeAt) {
    currentTime = freezeAt
    setIngameTime()
    return
  }
  if (!timeFrozen) {
    emitNet('nns_weather:client:time:request')
  }
})
