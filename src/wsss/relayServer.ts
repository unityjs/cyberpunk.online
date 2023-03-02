import net from 'net'
import winston from 'winston'
import WebSocket from 'ws'
import { Connection, TcpConnection, WebConnection } from './connection'
import { createLogger, MAX_CONNECTIONS } from './utils'

export interface ServerOptions {
	port?: number;
	server?: WebSocket.Server | net.Server;
	logLevel?: string
	serverName: string;
	callback: (client: Connection) => Promise<void>;
}

export class RelayServer {
	logger: winston.Logger
	constructor(options: ServerOptions) {
		this.logger = createLogger(options.serverName, options.logLevel)
		if (options.server) {
			if (options.server instanceof WebSocket.Server) {
				this.startWebSocketServer(options.server, options.callback)
				return
			} else if (options.server instanceof net.Server) {
				this.startTcpServer(options.server, options.callback)
				return
			}
		}
		if (options.port > 0) {
			const server = net.createServer({ allowHalfOpen: true, })
			server.listen(options.port)
			this.startTcpServer(server, options.callback)
			return
		}
	}

	private startTcpServer(server: net.Server, callback: (client: Connection) => Promise<void>) {
		server.maxConnections = MAX_CONNECTIONS
		server.on('connection', (socket) => {
			 new TcpConnection(this.logger, socket).run(callback)
		})
		server.on('close', () => {
			this.logger.info('server is closed')
		})
		server.on('error', (error) => {
			this.logger.error('server error', error)
		})
		server.on('listening', () => {
			this.logger.info('Server is listening')
		})
	}

	private startWebSocketServer(server: WebSocket.Server, callback: (client: Connection) => Promise<void>) {
		//return new Promise( (resolve, reject)=> {
		//var server = self.server
		/*server = config.wsserver new WebSocket.Server({
				host: address,
				port: port,
				perMessageDeflate: false,
				backlog: MAX_CONNECTIONS
			})*/
		server.on('connection', (socket) => {
			new WebConnection(this.logger, socket).run(callback)
		})

		server.on('error', (error) => {
			//self.logger.fatal('an error of', self.serverName, 'occured', error)
			this.logger.error('server error', error)
			//reject(error)
		})
		server.on('listening', () => {
			this.logger.info('server is listening')
			//resolve()
		})
		//})
	}
}