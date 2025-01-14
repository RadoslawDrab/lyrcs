import { getTime } from '@utils/time'
import { Line } from '@type/lyrics'

export function linesToLrc(lines: Line[]): string {
    return lines.reduce((str, l) => {
        return str += `[${ getTime(l.start) }][${ getTime(l.end) }]${ l.text }\n`
    }, '')
}

