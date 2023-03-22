import winston, { format } from "winston"

const ADDRESS_TYPE_IPV4 = 0x01
const ADDRESS_TYPE_DOMAIN_NAME = 0x03
const ADDRESS_TYPE_IPV6 = 0x04

export function parseAddressHeader(data: Buffer, offset: number) {
    if (data.length - offset < 7)
        throw "addressHeader error data.length < 7"

    const addressType = data.readUInt8(offset)
    //domain name
    if (addressType == ADDRESS_TYPE_DOMAIN_NAME) {
        const dstAddrLen = data.readUInt8(offset + 1)
        const dstAddr = data.slice(offset + 2, offset + 2 + dstAddrLen).toString()
        const dstPort = data.readUInt16BE(offset + 2 + dstAddrLen)
        const headerLen = 4 + dstAddrLen
        return { addressType, headerLen, dstAddr, dstPort }
    }
    //ipv4
    else if (addressType == ADDRESS_TYPE_IPV4) {
        const dstAddr = data.slice(offset + 1, offset + 5).join('.').toString()
        const dstPort = data.readUInt16BE(offset + 5)
        const headerLen = 7
        return { addressType, headerLen, dstAddr, dstPort }
    } else {
        throw "addressHeader error"
    }
}

export function renderSize(value: number): string {
    if (value > 1024)
        return (value / 1024).toFixed(1) + 'KB'
    return value + 'B'
}

export function renderTime(value: number): string {
    if (value > 1000) return (value / 1000).toFixed(1) + 's'
    return value + 'ms'
}

export const MAX_CONNECTIONS = 50000

export const sleep = (timeountMS) => new Promise((resolve) => {
    setTimeout(resolve, timeountMS);
})


/*winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'black',
    debug: 'gray'
});*/


const myFormat = format.combine(
    //format.label({ label: options.serverName }),
    format.timestamp(),
    format.colorize(),
    format.printf(({ level, message, stack, title, timestamp }) => {
        return `${timestamp} ${title} ${level}: ${message}${stack ? '\n' + stack : ''}`
    })
)
export function createLogger(title: string, level: string = "debug") {
    return winston.createLogger({
        defaultMeta: { title },
        format: myFormat,
        level,
        transports: [
            new winston.transports.Console({
                handleExceptions: true,
                //level: 'debug',
                format: format.combine(format.colorize(), myFormat)
            }),
            /*new winston.transports.File({
                level: 'debug',
                filename: `logs/${title}.log`,
            }),
            new winston.transports.File({
                filename: `logs/${title}_errors.log`,
                level: 'error'
            }),*/
            //new winston.transports.Http({ ssl: false, level: 'debug' })// 向web服务器上传日志
        ],
        /*exceptionHandlers: [
            new winston.transports.File({ filename: `logs/${title}_exceptions.log` })
        ]*/

    })

}