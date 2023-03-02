import { logger } from "./log"

/** 获取当前时间戳(秒) */
export function getCurTimestamp(time: Date = null): number {
    if (time != null)
        return Math.ceil(time.getTime() / 1000)
    return Math.ceil(new Date().getTime() / 1000)
}
/** 时间戳转时间 */
export function getTimeDate(time: number): Date {
    return new Date(time * 1000)
}
/** 判断是否是同一天 */
export function isSameDay(dateA: string | number | Date, dateB: string | number | Date) {
    return new Date(dateA).setHours(0, 0, 0, 0) == new Date(dateB).setHours(0, 0, 0, 0);
}

/** 判断是否是同一天UTC */
export function isUTCSameDay(dateA: string | number | Date, dateB: string | number | Date) {
    return new Date(dateA).setUTCHours(0, 0, 0, 0) == new Date(dateB).setUTCHours(0, 0, 0, 0);
}

/** 毫秒转换成天数 */
export function getDay(time: number): number { return Math.floor(time / (3600000 * 24)); }
/** 毫秒转换成小时数 */
export function getHours(time: number): number { return Math.floor(time / 3600000); }
/** 秒数转换成天数 */
export function getDayInSeconds(time: number): number { return Math.floor(time / (3600 * 24)); }
/** 秒数转换成小时数 */
export function getHoursInSeconds(time: number): number { return Math.floor(time / 3600); }
/** 获取当前天数 *///new Date().setUTCHours(0, 0, 0, 0) / 86_400_000
export function getNowDay(): number { return Math.floor(Date.now() / (3600000 * 24)); }
/** 获取当前小时数 */
export function getNowHours(): number { return Math.floor(Date.now() / 3600000); }
/** 浮点数固定小数点精度 */
export function floatFixed2(value: number): number { return parseFloat(value.toFixed(2)); }
/** 浮点数固定小数点精度 */
export function floatFixed(value: number, fractionDigits: number): number { return parseFloat(value.toFixed(fractionDigits)); }

/** 休眠 */
export function sleep(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/** 毫秒转字符串 */
export function millisecondsToStr(milliseconds) {
    let temp = Math.floor(milliseconds / 1000);
    let result = ''
    const years = Math.floor(temp / 31536000);
    if (years) result += years + 'y';
    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) result += days + 'd';
    const hours = Math.floor((temp %= 86400) / 3600);
    if (hours) result += hours + 'h';
    const minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) result = minutes + 'm' + result;
    const seconds = temp % 60;
    if (seconds) result += seconds + 's';
    return result;
}

/** 毫秒转字符串 */
export function timeToStr(milliseconds) {
    let temp = Math.floor(milliseconds / 1000);
    let result = ''
    const years = Math.floor(temp / 31536000);
    if (years) result += years + 'y';
    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) result += days + 'd';
    if (result.length > 0)
        return result
    const hours = Math.floor((temp %= 86400) / 3600)
    //if (result.length > 0) result += '_' + hours.toString().padStart(2, '0')
    if (hours) result += hours.toString()
    const minutes = Math.floor((temp %= 3600) / 60)
    if (result.length > 0) result += ':' + minutes.toString().padStart(2, '0')
    else if (minutes) result += minutes.toString()

    const seconds = temp % 60
    if (result.length > 0) result += ':' + seconds.toString().padStart(2, '0')
    else result += seconds.toString() + 's'
    return result
}

export function safeSetTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timeout {
    return setTimeout(async (...args: any[]) => {
        try {
            await callback(...args)
        } catch (error) {
            logger.error('safeSetTimeout', error)
        }
    }, ms, ...args)
    //return setTimeout(callback, ms, ...args)
}

/** 延迟一段时间后执行回调 */
export function delayCall(callback: (...args: any[]) => void, ms: number, ...args: any[]): () => void {
    let timeout: NodeJS.Timer = null
    return () => {
        if (timeout)
            clearTimeout(timeout)
        timeout = setTimeout((...args) => {
            timeout = null
            callback(...args)
        }, ms, ...args)
    }
}

/** 缓存一段时间内执行回调 */
export function cacheCall(callback: (...args: any[]) => void, ms: number, ...args: any[]): () => void {
    let timeout: NodeJS.Timer = null
    return () => {
        if (timeout)
            return
        timeout = setTimeout((...args) => {
            timeout = null
            callback(...args)
        }, ms, ...args)
    }
}