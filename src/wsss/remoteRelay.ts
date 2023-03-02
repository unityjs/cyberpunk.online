import net from 'net'
import { Encryptor } from './encrypt'
import { parseAddressHeader, sleep } from './utils'
import { AgentConnection, AgentConnectionManager, Connection, TcpConnection } from './connection'

const TCP_RELAY_TYPE_LOCAL = 1
const TCP_RELAY_TYPE_SERVER = 2

const VERSION = 0x05

const METHOD_NO_AUTHENTICATION_REQUIRED = 0x00
const METHOD_GSSAPI = 0x01
const METHOD_USERNAME_PASSWORD = 0x02
const METHOD_NO_ACCEPTABLE_METHODS = 0xff

const CMD_CONNECT = 0x01
const CMD_BIND = 0x02
const CMD_UDP_ASSOCIATE = 0x03
const CMD = {
	1: 'CONNECT',
	2: 'BIND',
	3: 'UDP_ASSOCIATE'
}

const REPLIE_SUCCEEDED = 0x00
const REPLIE_GENERAL_SOCKS_SERVER_FAILURE = 0x01
const REPLIE_CONNECTION_NOT_ALLOWED_BY_RULESET = 0x02
const REPLIE_NETWORK_UNREACHABLE = 0x03
const REPLIE_HOST_UNREACHABLE = 0x04
const REPLIE_CONNECTION_REFUSED = 0x05
const REPLIE_TTL_EXPIRED = 0x06
const REPLIE_COMMAND_NOT_SUPPORTED = 0x07
const REPLIE_ADDRESS_TYPE_NOT_SUPPORTED = 0x08

export async function remoteRelay(client: Connection, password: string, method: string) {
	const encryptor = new Encryptor(password, method)
	let data = await client.getData()
	data = encryptor.decrypt(data)
	const addressHeader = parseAddressHeader(data, 0)

	client.logger = Object.create(client.logger)
	client.logger.defaultMeta = ({ title: client.logger.defaultMeta.title + "[" + addressHeader.dstAddr + ":" + addressHeader.dstPort + "]" })

	const socket = net.createConnection({ port: addressHeader.dstPort, host: addressHeader.dstAddr, allowHalfOpen: true })
	const server = new TcpConnection(client.logger, socket)
	await server.run(async () => {
		if (data.length > addressHeader.headerLen)
			server.send(data.slice(addressHeader.headerLen))

		while (!client.isDestroyed && !server.isDestroyed) {
			while (client.dataCache.length > 0) {
				const data = client.dataCache.shift()
				server.send(encryptor.decrypt(data))
			}
			await sleep(1)
			server.pause()
			while (server.dataCache.length > 0) {
				const data = server.dataCache.shift()
				await client.send(encryptor.encrypt(data))
			}
			server.resume()
			await sleep(1)
		}
	})
}

export async function remoteMultRelay(source: Connection, password: string, method: string) {
	let data = await source.getData()
	if (data.length > 5 && data.readUInt32BE(0) == 0 && data.readUInt8(4) == 0) {
		source.dataCache.unshift(data)
		const agents = new AgentConnectionManager(source)
		await agents.run2(async (client) => {
			await remoteRelay(client, password, method)
		})
	} else {
		source.dataCache.unshift(data)
		await remoteRelay(source, password, method)
	}
}