/*import net from 'net'
import WebSocket from 'ws'
import { Connection } from './connection'
import { renderSize, sleep } from './utils'

export class RelayConnection {
	client: Connection
	server: Connection

	constructor(client: Connection) {
		this.client = client
	}

	async run(socket: WebSocket | net.Socket) {
		this.socket = socket
		try {
			await this.startConnection(socket)
		} catch (e) {
			if (e)
				this.client.error(e.toString())
		}
		this.destroy()
	}

	async pingpong() {
		while (1) {
			while (this.client.dataCache.length > 0) {
				const data = this.client.dataCache.shift()
				this.server.send(data)
			}
			await sleep(1)
			while (this.server.dataCache.length > 0) {
				const data = this.server.dataCache.shift()
				this.client.send(data)
			}
			await sleep(1)
			//let data
			//try {
			//	data = await this.client.getData()
			//} catch (e) {
			//	this.destroy()
			//	reject(`RemoteRelay getData error: ${e}`)
			//}
			//if (!this.socket) return
			//this.client.debug(`${this.sendCount}/${this.acceptCount} Send data[${renderSize(data.length)}]`)
			//this.sendCount++
			//this.send(data)
		}
	}

	//onData(data: Buffer) {
	//	this.acceptCount++
	//	this.client.debug(`${this.sendCount}/${this.acceptCount} Accept data[${renderSize(data.length)}]`)
	//	this.client.send(data)
	//}
}
export class TcpRelayConnection extends RelayConnection {
	declare socket: net.Socket

	startConnection(socket: net.Socket): Promise<void> {
		return new Promise((resolve, reject) => {
			socket.on('connect', async () => { await this.onConnect(reject) })
			socket.on('data', (data: Buffer) => { this.onData(data) })
			socket.on('end', () => {
				this.client.info(`end event of proxy has been triggered`)
				//client.close()
				resolve()
			})
			socket.on('close', (hadError) => {
				this.client.info(`close event[had error = ${hadError}] of proxy has been triggered`)
				//client.close()
				resolve()
			})
			socket.on('error', (error) => {
				socket.destroy()
				reject(`an error of proxy occured ${error}`)
				//client.close()
			})
		})
	}

	send(data: Buffer | Uint8Array | string) {
		if (this.socket)
			this.socket.write(data)
	}

	destroy() {
		if (this.socket) {
			this.socket.end()
			this.socket.destroy()
			this.socket = null
		}
	}
}

export class WebRelayConnection extends RelayConnection {
	declare socket: WebSocket
	startConnection(socket: WebSocket): Promise<void> {
		return new Promise((resolve, reject) => {
			socket.on('open', async () => { await this.onConnect(reject) })
			socket.on('message', (data: Buffer) => { this.onData(data) })
			socket.on('error', (error) => {
				reject(`server connection: error event ${error}`)
			})
			socket.on('close', (code, reason) => {
				this.client.debug(`server connection: close event[code = '${code}']`)
				resolve()
			})
		})
	}

	send(data: Buffer | Uint8Array | string) {
		if (this.socket)
			this.socket.send(data, { binary: true })
	}

	destroy() {
		if (this.socket) {
			this.socket.terminate()
			this.socket.close()
			this.socket = null
		}
	}
}*/