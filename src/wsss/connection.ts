import { promises } from 'dns'
import net from 'net'
import winston from 'winston'
import WebSocket from 'ws'
import { MAX_CONNECTIONS, renderSize, sleep } from './utils'

export class Connection {
	static connections: { [key: number]: Connection } = {}
	static globalSocketCount: number = 0
	sendCount: number = 0
	acceptCount: number = 0
	logger: winston.Logger
	protected socket: net.Socket | WebSocket
	private socketId: number
	dataCache: Buffer[] = []
	isConnected: boolean = false
	isDestroyed: boolean = false

	constructor(logger: winston.Logger, socket: net.Socket | WebSocket) {
		this.socket = socket
		for (let i = 0; i < MAX_CONNECTIONS; ++i) {
			if (!Connection.connections[i]) {
				this.socketId = i
				Connection.connections[i] = this
				break
			}
		}
		this.logger = Object.create(logger)
		this.logger.defaultMeta = { title: logger.defaultMeta.title + "-" + this.socketId }
		this.startConnection()
	}

	async waitConnected() {
		while (true) {
			if (this.isConnected)
				return
			if (this.isDestroyed)
				throw 'isDestroyed'
			await sleep(1)
		}
	}

	async getData(): Promise<Buffer> {
		while (true) {
			if (this.dataCache.length > 0)
				return this.dataCache.shift()
			if (this.isDestroyed)
				throw 'isDestroyed'
			await sleep(1)
		}
	}

	async run(callback: (client: Connection) => Promise<void>) {
		Connection.globalSocketCount++
		try {
			await this.waitConnected()
			await callback(this)
		} catch (e) {
			this.logger.error(e)
		}
		this.destroy()
		Connection.connections[this.socketId] = null
		this.logger.info(`closed [globalSocketCount=${Connection.globalSocketCount}]`)
		Connection.globalSocketCount--
	}

	protected startConnection() { }
	protected async onConnect() { this.isConnected = true }

	onData(data: Buffer) {
		this.acceptCount++
		this.logger.debug(`${this.sendCount}/${this.acceptCount} Accept data[${renderSize(data.length)}]`)
		this.dataCache.push(data)
	}

	send(data: Buffer | Uint8Array | string): Promise<void> {
		this.sendCount++
		//this.logger.debug(`${this.sendCount}/${this.acceptCount} Send data[${renderSize(data.length)}]`)
		return
	}

	pause() { }
	resume() { }

	destroy() {
		this.isDestroyed = true
	}
}

export class TcpConnection extends Connection {
	declare socket: net.Socket

	protected startConnection() {
		this.socket.setKeepAlive(false)//?
		this.socket.on('data', (data) => this.onData(data))
		this.socket.on('end', () => {
			this.logger.info(`end event`)
			this.destroy()
		})
		this.socket.on('close', (hadError) => {
			if (hadError) this.logger.error(`close event had error`)
			else this.logger.info(`close event`)
			this.destroy()
		})
		this.socket.on('error', (error) => {
			this.logger.error(`error event`, error)
			this.destroy()
		})

		if (!this.socket.connecting)
			this.onConnect()
		else {
			const timeBegin = Date.now()
			this.socket.on('connect', () => {
				this.logger.info(`connected [${Date.now() - timeBegin}ms]`)
				this.onConnect()
			})
		}
	}

	send(data: Buffer | Uint8Array | string): Promise<void> {
		return new Promise((resolve, reject) => {
			super.send(data)
			if (this.socket)
				this.socket.write(data, () => {
					resolve()
				})
			else
				resolve()
		})
	}

	pause() {
		if (this.socket)
			this.socket.pause()
	}

	resume() {
		if (this.socket)
			this.socket.resume()
	}

	destroy() {
		super.destroy()
		if (this.socket) {
			this.socket.end()
			this.socket.destroy()
			this.socket = null
		}
	}
}

export class WebConnection extends Connection {
	declare socket: WebSocket
	/*client.on('pong', ()=> {
		logger.info(`[${clientId}]: client pong`)
	})
	heartbeat = setInterval(ping()=> {
		if (client.readyState != WebSocket.OPEN) return
		client.ping()
		logger.info(`[${clientId}]: ping`)
	}, 30000)*/
	protected startConnection() {
		this.socket.on('message', (data: Buffer) => this.onData(data))
		this.socket.on('close', (code, reason) => {
			this.logger.info(`close event [code='${code}' reason='${reason}']`)
			this.destroy()
			//if (heartbeat) clearInterval(heartbeat)
			//proxy && proxy.destroy()
		})
		this.socket.on('error', (error) => {
			this.logger.error(`error event`, error)
			this.destroy()
			//if (heartbeat) clearInterval(heartbeat)
			//proxy && proxy.end()
		})

		if (this.socket.readyState == WebSocket.OPEN)
			this.onConnect()
		else {
			const timeBegin = Date.now()
			this.socket.on('open', () => {
				this.logger.info(`connected [${Date.now() - timeBegin}ms]`)
				this.onConnect()
			})
		}
	}

	send(data: Buffer | Uint8Array | string): Promise<void> {
		return new Promise((resolve, reject) => {
			super.send(data)
			if (this.socket && this.socket.readyState == WebSocket.OPEN)
				this.socket.send(data, { binary: true }, () => {
					resolve()
				})
			else
				resolve()
		})
		//super.send(data)
		//if (this.socket && this.socket.readyState == WebSocket.OPEN) {
		//client.ping()
		//proxy.pause()
		//	this.socket.send(data, { binary: true }/*, () => { proxy.resume() }*/)
		//}
	}

	pause() {
	}

	resume() {
	}

	destroy() {
		super.destroy()
		if (this.socket) {
			this.socket.terminate()
			this.socket.close()
			this.socket = null
		}
	}
}

export class AgentConnectionManager {
	globleIndex: number = 0
	connections: { [key: number]: AgentConnection } = {}
	source: Connection
	constructor(source: Connection) {
		this.source = source
		source.logger.defaultMeta = { title: source.logger.defaultMeta.title + "-Agent" }
		source.logger.level = "debug"
		source.logger.info("创建 Agents")
	}
	find(id: number): AgentConnection { return this.connections[id] }
	create(id: number = null): AgentConnection {
		let headerCode = 1
		if (id == null) {
			id = this.globleIndex
			this.globleIndex = (this.globleIndex + 1) % MAX_CONNECTIONS
			headerCode = 0
		}
		const agent = new AgentConnection(this, id, headerCode)
		this.connections[id] = agent
		return agent
	}
	async run() {
		while (!this.source.isDestroyed) {
			while (this.source.dataCache.length > 0) {
				const data = this.source.dataCache.shift()
				const id = data.readUInt32BE(0)
				const code = data.readUInt8(4)
				const agent = this.find(id)

				if (code == 0) {
					if (agent) agent.dataCache.push(data.slice(6))
					else this.source.logger.error(`bad agent! ${id}`)
				}
				else if (code == 1) {
					if (agent) agent.dataCache.push(data.slice(6))
					else this.source.logger.error(`unknown agent! ${id}`)
				} else if (code == 2) {
					if (agent) agent.destroy()
					//else source.logger.error(`已经销毁了 ${id}`)
				} else {
					this.source.logger.error(`bad code! ${id}:${code}`)
				}
			}
			await sleep(1)
		}
	}
	async run2(callback: (client: Connection) => Promise<void>) {
		while (!this.source.isDestroyed) {
			while (this.source.dataCache.length > 0) {
				const data = this.source.dataCache.shift()
				const id = data.readUInt32BE(0)
				const code = data.readUInt8(4)
				let agent = this.find(id)

				if (code == 0) {
					if (agent)
						this.source.logger.error(`bad agent! ${id}`)
					agent = this.create(id)
					agent.dataCache.push(data.slice(6))
					agent.run(callback)
				} else if (code == 1) {
					if (agent) agent.dataCache.push(data.slice(6))
					else this.source.logger.error(`unknown agent! ${id}`)
				} else if (code == 2) {
					if (agent) agent.destroy()
				} else {
					this.source.logger.error(`bad code! ${id}:${code}`)
				}
			}
			await sleep(1)
		}
	}

}

export class AgentConnection extends Connection {
	manager: AgentConnectionManager
	agentId: number
	private header: Buffer
	private get source() { return this.manager?.source }

	constructor(manager: AgentConnectionManager, agentId: number, headerCode: number) {
		//super(source.logger, source.socket)
		super(manager.source.logger, null)
		this.manager = manager
		this.agentId = agentId
		this.header = Buffer.alloc(6)
		this.header.writeUInt32BE(this.agentId, 0)
		this.header.writeUInt8(headerCode, 4)
	}

	async waitConnected() {
		await this.source.waitConnected()
	}


	send(data: Buffer): Promise<void> {
		data = Buffer.concat([this.header, data])
		this.header.writeUInt8(1, 4)
		if (this.source)
			return this.source.send(data)
	}

	pause() {
		if (this.source)
			this.source.pause()
	}

	resume() {
		if (this.source)
			this.source.resume()
	}

	destroy() {
		super.destroy()
		if (this.manager) {
			this.header.writeUInt8(2, 4)
			this.source.send(this.header)
			this.manager.connections[this.agentId] = null
			this.manager = null
			//this.logger.warn(`代理 ${this.agentId} 销毁`)
		}
	}
}