import winston from "winston"

const { timestamp, colorize, printf, combine } = winston.format
const formatConsole = combine(
    //label({ label: options.serverName }),
    timestamp({ format: 'HH:mm:ss' }),
    printf(({ level, message, stack, parent, title, timestamp }) => {
        while (parent) {
            if (parent.defaultMeta.title)
                title = parent.defaultMeta.title + '|' + title
            parent = parent.defaultMeta.parent
        }
        if (typeof stack === 'string') {
            if (stack.includes(message)) message = stack
            else message += '\n' + stack
        }
        return `${timestamp} ${title ? title + ' ' : ''}${level}: ${message}`
    })
)

const format = combine(
    timestamp(),
    printf(({ name, level, message, stack, parent, title, timestamp }) => {
        while (parent) {
            if (parent.defaultMeta.title)
                title = parent.defaultMeta.title + '|' + title
            parent = parent.defaultMeta.parent
        }
        if (typeof stack === 'string') {
            if (stack.includes(message)) message = stack
            else message += '\n' + stack
        }
        return `${name} ${timestamp} ${title ? title + ' ' : ''}${level}: ${message}`
    })
)

/** 创建日志 */
export function createLogger(name: string, level: string = "debug"): winston.Logger {
    const l = winston.createLogger({
        defaultMeta: { name },
        format,
        level,
        transports: [
            new winston.transports.Console({
                handleExceptions: true,
                //level: 'debug',
                format: combine(colorize(), formatConsole)
            }),
            new winston.transports.File({
                level: 'debug',
                filename: name + '.log',
            }),
            new winston.transports.File({
                filename: name + '_errors.log',
                level: 'error'
            }),
            //new winston.transports.Http({ ssl: false, level: 'debug' })// 向web服务器上传日志
        ],
        exceptionHandlers: [
            new winston.transports.File({ filename: name + 'exceptions.log' })
        ]
    })
    logger ||= l
    return l
}

/** 创建子日志 */
export function createChildLogger(title: string, parent: winston.Logger = logger): winston.Logger {
    parent ||= logger
    const newLogger: winston.Logger = Object.create(parent)

    newLogger.defaultMeta = Object.create(parent.defaultMeta)
    newLogger.defaultMeta.parent = parent
    newLogger.defaultMeta.title = title
    return newLogger
}

/** 默认日志 */
export let logger: winston.Logger