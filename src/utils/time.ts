export function getTimeFormatted(time: number): string {
    const milliseconds = Math.round((time - Math.floor(time)) * 1000)
    const minutes = Math.floor(time / 60)
    const seconds = Math.round(time % 60)

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`
}