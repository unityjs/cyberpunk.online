

/** 安全的Json字符串化 */
export function SelfJsonStringify(value: any): string {
    // 声明cache变量，便于匹配是否有循环引用的情况
    let cache = []
    const str = JSON.stringify(value, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // 移除
                return
            }
            // 收集所有的值
            cache.push(value)
        }
        return value
    })
    cache = null // 清空变量，便于垃圾回收机制回收
    return str
}

/*declare global {
    interface String {
        format: (...args: any) => any
    }
}
String.prototype.format = function (args) {*/

export function stringFormat(format: string, ...args: any[]) {
    if (args.length == 1 && typeof (args[0]) == "object") {
        for (var key in args[0]) {
            var reg = new RegExp("({" + key + "})", "g")
            format = format.replace(reg, args[0][key])
        }
    } else {
        for (var i = 0; i < args.length; i++) {
            var reg = new RegExp("({[" + i + "]})", "g")
            format = format.replace(reg, args[i])
        }
    }
    return format
}

//String.prototype.byteLength = function () {
export function stringByteLength(text: string) {
    let len = 0;
    for (let i = 0, n = text.length; i < n; i++) {
        if (text.charCodeAt(i) > 127)
            len += 2
        else
            len++
    }
    return len
}