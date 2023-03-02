import { ServerOptions } from "https"
import fs from "fs"
import path from "path"
import tls, { SecureContext, SecureContextOptions } from "tls"

export function loadJsonConfig(path: string) {
    if (!fs.existsSync(path)) {
        console.log(path + "文件不存在")
        return
    }
    let json = JSON.parse(fs.readFileSync(path, 'utf8') || '{}')
    let defaultJson = json.default || {}
    for (const key in json) {
        if (key != "default") {
            json[key] = Object.assign({}, defaultJson, json[key])
        }
    }
    return json
}

export function watchConfig(path: string) {
    const config = loadJsonConfig(path)
    fs.watchFile(path, (cur, prv) => {
        if (cur.mtime != prv.mtime) {
            console.log(`${path}文件发生更新 cur.mtime>>${cur.mtime.toLocaleString()} prv.mtime>>${prv.mtime.toLocaleString()}`)
            const newConfig = loadJsonConfig(path)
            for (let key in config) delete config[key]
            Object.assign(config, newConfig);
        }
    })
    return config
}

type MyServerOptions = ServerOptions & { secureContext: { [key: string]: SecureContext }, defaultSecureContext?: SecureContext };

function createServerOptions(): MyServerOptions {
    const options: MyServerOptions = { secureContext: {} }
    const badHosts: string[] = []
    options.SNICallback = (servername, cb) => {
        let ctx = options.secureContext[servername]
        if (!ctx) {
            const host = servername.substring(servername.indexOf(".") + 1)
            ctx = options.secureContext[host]
        }
        if (!ctx) {
            if (!badHosts.includes(servername)) {
                badHosts.push(servername)
                console.warn(`SNICallback ${servername}`)
            }
            if (!options.defaultSecureContext) {
                console.error(`No SecureContext ${servername}`)
                return
            }
            ctx = options.defaultSecureContext
        }
        cb(null, ctx)
    }
    return options
}

export function loadCerts(dir: string = './certs', options?: MyServerOptions): MyServerOptions {
    if (!options) options = createServerOptions()
    if (!fs.existsSync(dir)) return options
    const pa = fs.readdirSync(dir)

    function readFile(path: string): string | undefined {
        if (!fs.existsSync(path)) return undefined
        return fs.readFileSync(path, 'utf8')
    }
    for (const ele of pa) {
        const pathname = path.join(dir, ele)
        if (!fs.statSync(pathname).isFile()) continue
        const ext = path.extname(pathname)
        if (ext != '.cer') continue
        const domain = path.basename(pathname, ext)

        const cert = readFile(pathname)
        const key = readFile(path.join(dir, domain + ".key"))
        if (!key) {
            console.error(`缺失 ${domain} 的私钥`)
            continue
        }
        const ca = readFile(path.join(dir, domain + ".ca"))
        if (!ca) {
            console.warn(`缺失 ${domain} 的根证书`)
        }
        const sco = tls.createSecureContext({ cert, key, ca })
        if (!options.defaultSecureContext) {
            options.cert = cert
            options.key = key
            options.ca = ca
            options.defaultSecureContext = sco
        }
        options.secureContext[domain] = sco
    }
    return options
}