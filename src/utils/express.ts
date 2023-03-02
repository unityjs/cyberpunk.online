import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import http, { IncomingMessage, RequestListener, Server, ServerResponse } from "http"
import https from "https"
import url from 'url'
import urlib from "url"
import { loadCerts } from "./fileLoader"

function assignBody(req: Request, res: Response, next: NextFunction) {
    if (req.body == null) req.body = req.query;
    else Object.assign(req.body, req.query);
    next()
}

function redirectWWW(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host
    if (!host) return
    if (host.split('.').length === 2) {
        const pathname = url.parse(req.url).pathname
        res.redirect('https://www.' + host + pathname)
    } else {
        return next()
    }
}

function redirectHttps(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host?.replace(/\:\d+$/, ''); // Remove port number
    //res.redirect(307, `https://${host}${req.path}`);
    res.redirect(307, `https://${host}${req.originalUrl}`);
    //if (req.headers['x-forwarded-proto'] != 'https') res.redirect('https://' + req.headers.host + req.originalUrl);else next();
}

/** 创建Express */
export function createExpress(): express.Express {
    const app = express()
    app.use(cors())
    app.use(express.json(), assignBody)
    //import bodyParser from 'body-parser'
    //app.use(bodyParser.urlencoded({ extended: true }))
    app.use(redirectWWW)

    return app
}

//import session from 'express-session'
/*routerGA.use(session({
  secret: 'secret', // 对session id 相关的cookie 进行签名
  name: '_sid',
  resave: true,
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    //path: "/ga",
    //domain: "api.unityjs.net"
  },
}))*/

/** 创建服务器*/
export function createServer(requestListener?: RequestListener, useSSL: boolean = false): Server {
    const server = useSSL ? https.createServer(loadCerts('/certs', loadCerts('./certs')), requestListener) : http.createServer(requestListener)
    return server
}

/** 启动端口*/
export async function serverListen(server: Server, port: number, hostname?: string, backlog?: number, listeningListener?: Function) {
    return new Promise<void>((resolve, reject) => {
        const onlistening = () => {
            //console.log(...arguments)
            server.removeListener('error', onError)
            server.removeListener('listening', onlistening)
            if (listeningListener)
                listeningListener(...arguments);
            //if (arguments[0])
            //    reject(arguments[0]);
            //else
            resolve();
        }
        const onError = (err: Error) => {
            server.removeListener('error', onError)
            server.removeListener('listening', onlistening)
            reject(err)
        }
        server.on('error', onError);
        server.listen(port, hostname, backlog, onlistening);
    });
}


/** 创建http到https转换服务器*/
export function createRedirectHttpsServer(port: number = 80): Server {
    const server = http.createServer(express().use(cors(), redirectHttps))
    server.listen(port, function () { console.log(`Http to Https Server Running on ${port}`) })
    return server
}

export function getClientIp(req: Request): string {
    return req.headers['x-forwarded-for'] as string ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        //req.connection.socket.remoteAddress ||
        ''
}

function toUnicode(str: string) {
    let unicode = ''
    for (let i = 0; i < str.length; i++) {
        const temp = str.charCodeAt(i)
        if (temp > 127) unicode += '\\u' + temp.toString(16)
        else unicode += str.charAt(i)
    }
    return unicode
}

function getXFF(req: Request) {
    let xff = req.header("x-forwarded-for")
    const curIP = req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.remoteAddress || ''
    if (xff && xff.length > 0) xff += "," + curIP
    else xff = curIP
    return xff
}

/** url代理 */
export function GetProxyRouter(urlHandle: (url: string) => string = url => url.replace(/\/(http[s]?)\//, '$1://')) {
    //url => "https://api.unityjs.net" + url.substr(7)
    return function (req: Request, res: Response, next: NextFunction) {
        try {
            const urlWithParsedQuery = urlib.parse(urlHandle(req.originalUrl), true)
            const { protocol, port, auth, host, hostname, path } = urlWithParsedQuery
            const options: https.RequestOptions = { protocol, port, auth, host, hostname, path, method: req.method }
            options.headers = { "x-forwarded-for": getXFF(req) }
            let content = null
            if (req.method == "POST") {
                content = toUnicode(JSON.stringify(req.body))
                options.headers['Content-Type'] = 'application/json'//'multipart/form-data'//根据提交请求类型不同而不同，以上适用多媒体文件 //可查询各种报头类型代表的意思
                options.headers['Content-Length'] = content.length
            }
            const request = (options.protocol == "https:" ? https : http).request(options, function (response) { response.pipe(res) })
            if (content) request.write(content)
            request.end()
        } catch (e) {
            console.error(e)
            res.send(e)
        }
    }
}