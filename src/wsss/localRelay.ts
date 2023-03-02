import winston from 'winston'
import WebSocket from 'ws'
import { AgentConnection, AgentConnectionManager, Connection, WebConnection } from './connection'
import { Encryptor } from './encrypt'
import { parseAddressHeader, renderSize, sleep } from './utils'

const CMD_CONNECT = 0x01
const CMD_BIND = 0x02
const CMD_UDP_ASSOCIATE = 0x03
const CMD = {
	1: 'CONNECT',
	2: 'BIND',
	3: 'UDP_ASSOCIATE'
}

function CreateConnection(logger: winston.Logger, serverAddress: string): Connection {
	return new WebConnection(logger, new WebSocket(serverAddress, { perMessageDeflate: false }))
}

let agents: AgentConnectionManager

function CreateAgentConnection(logger: winston.Logger, serverAddress: string): Connection {
	if (!agents || !agents.source || agents.source.isDestroyed) {
		const source = new WebConnection(logger, new WebSocket(serverAddress, { perMessageDeflate: false }))
		agents = new AgentConnectionManager(source)
		source.run(async () => { await agents.run() })
	}
	const agent = agents.create()
	return agent
}


export async function localRelay(client: Connection, serverAddress: string) {
	const server = CreateConnection(client.logger, serverAddress)
	await server.run(async () => {
		while (!client.isDestroyed && !server.isDestroyed) {
			while (client.dataCache.length > 0) {
				const data = client.dataCache.shift()
				server.send(data)
			}
			await sleep(1)
			while (server.dataCache.length > 0) {
				const data = server.dataCache.shift()
				client.send(data)
			}
			await sleep(1)
		}
	})
}

async function socket5Header(client: Connection) {
	//debug(`read data[${data.length}] from client connection at stage[${STAGE[stage]}]`)
	let data = await client.getData()
	if (data.length < 3 || data.readUInt8(0) != 5)
		throw "client connection: Bad Head1!"
	client.send("\x05\x00")

	//
	data = await client.getData()
	if (data.length < 10 || data.readUInt8(0) != 5) {
		throw "client connection: Bad Head2!"
	}
	const cmd = data.readUInt8(1)
	const addressHeader = parseAddressHeader(data, 3)

	client.logger = Object.create(client.logger)
	client.logger.defaultMeta = ({ title: client.logger.defaultMeta.title + "[" + addressHeader.dstAddr + ":" + addressHeader.dstPort + "]" })

	//only supports connect cmd
	if (cmd != CMD_CONNECT) {
		client.send("\x05\x07\x00\x01\x00\x00\x00\x00\x00\x00")
		throw "client connection: only supports connect cmd!"
	}
	//info(`connecting`)
	client.send("\x05\x00\x00\x01\x00\x00\x00\x00\x00\x00")

	client.dataCache.unshift(data.slice(3))
}

export async function socket5Relay(client: Connection, serverAddress: string, password: string, method: string) {
	await socket5Header(client)
	const encryptor = new Encryptor(password, method)
	const server = CreateConnection(client.logger, serverAddress)
	await server.run(async () => {
		while (!client.isDestroyed && !server.isDestroyed) {
			//client.pause()
			while (client.dataCache.length > 0) {
				const data = client.dataCache.shift()
				await server.send(encryptor.encrypt(data))
			}
			//client.resume()
			await sleep(1)
			while (server.dataCache.length > 0) {
				const data = server.dataCache.shift()
				client.send(encryptor.decrypt(data))
			}
			await sleep(1)
		}
	})
}