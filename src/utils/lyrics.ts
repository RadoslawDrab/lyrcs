import { getTime } from './time'
import { Line } from '../types/lyrics'

export function linesToLrc(lines: Line[]): string {
    return lines.reduce((str, l) => {
        return str += `[${getTime(l.start)}][${getTime(l.end)}]${l.text}\n`
    }, '')
}
