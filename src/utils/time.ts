export function getTime(time: number, msPad: number = 2): string {
    const milliseconds = Math.round((time - Math.floor(time)) * 1000)
    const seconds = Math.floor(time) % 60
    const minutes = (Math.floor(time) - seconds) / 60

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(msPad, '0')}`
}