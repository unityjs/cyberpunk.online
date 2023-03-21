import { localRelay, socket5Relay } from './localRelay'
import { RelayServer } from './relayServer'
import http from "http"
import WebSocket from 'ws'
import { remoteMultRelay } from './remoteRelay'

/*local
    .version('0.1.8')
    .option('-m --method <method>', 'encryption method, default: aes-256-cfb')
    .option('-k --password <password>', 'password')
    .option('-s --server-address <address>', 'server address')
    .option('-p --server-port <port>', 'server port, default: 8388')
    .option('-b --local-address <address>', 'local binding address, default: 127.0.0.1')
    .option('-l --local-port <port>', 'local port, default: 1080')
    .option('--log-level <level>', 'log level(debug|info|warn|error|fatal)', /^(debug|info|warn|error|fatal)$/i, 'info')
    .option('--log-file <file>', 'log file')
    .parse(process.argv)*/

let serverAddress = 'ws://cyberpunk-online-unityjs.vercel.app:443'//'ws://www.cyberpunk.online'//'ws://www.miuigame.com'//'ws://185.199.224.214:80'//'wss://unityjs.herokuapp.com:443'//// 'ws://45.195.134.30:80'

new RelayServer({
    port: 9080,
    serverName: 'Proxy',
    logLevel: 'info',
    callback: async (client) => {
        client.logger.level = "info"
        await socket5Relay(client, serverAddress, 'wasduijk', 'aes-256-cfb')
    }
})
/*
new RelayServer({
    port: 8388,
    serverName: 'Remote',
    logLevel: 'warn',
    callback: async (client) => {
        client.logger.level = "info"
        await localRelay(client, serverAddress)
    }
})*/
/*
serverAddress = 'ws://localhost'
const httpServer = http.createServer()
httpServer.listen(80, function () { console.log('Running on http://%s', httpServer.address()) })

const wss = new WebSocket.Server({ server: httpServer })
console.log("WebSocket ok")

new RelayServer({
    server: wss,
    serverName: 'wsss',
    logLevel: 'debug',
    callback: async (client) => {
        await remoteMultRelay(client, 'wasduijk', 'aes-256-cfb')
    }
})
*/