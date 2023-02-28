const net = require('net');
const path = require('path');
const log4js = require('log4js');
const WebSocket = require('ws');
const Encryptor = require('./encrypt').Encryptor;
const WSErrorCode = require('ws/lib/ErrorCodes');

const MAX_CONNECTIONS = 50000;

const TCP_RELAY_TYPE_LOCAL = 1;
const TCP_RELAY_TYPE_SERVER = 2;

const ADDRESS_TYPE_IPV4 = 0x01;
const ADDRESS_TYPE_DOMAIN_NAME = 0x03;
const ADDRESS_TYPE_IPV6 = 0x04;
const ADDRESS_TYPE = {
	1: 'IPV4',
	3: 'DOMAIN_NAME',
	4: 'IPV6'
};

const VERSION = 0x05;

const METHOD_NO_AUTHENTICATION_REQUIRED = 0x00;
const METHOD_GSSAPI = 0x01;
const METHOD_USERNAME_PASSWORD = 0x02;
const METHOD_NO_ACCEPTABLE_METHODS = 0xff;

const CMD_CONNECT = 0x01;
const CMD_BIND = 0x02;
const CMD_UDP_ASSOCIATE = 0x03;
const CMD = {
	1: 'CONNECT',
	2: 'BIND',
	3: 'UDP_ASSOCIATE'
};

const REPLIE_SUCCEEDED = 0x00;
const REPLIE_GENERAL_SOCKS_SERVER_FAILURE = 0x01;
const REPLIE_CONNECTION_NOT_ALLOWED_BY_RULESET = 0x02;
const REPLIE_NETWORK_UNREACHABLE = 0x03;
const REPLIE_HOST_UNREACHABLE = 0x04;
const REPLIE_CONNECTION_REFUSED = 0x05;
const REPLIE_TTL_EXPIRED = 0x06;
const REPLIE_COMMAND_NOT_SUPPORTED = 0x07;
const REPLIE_ADDRESS_TYPE_NOT_SUPPORTED = 0x08;

const STAGE_INIT = 0;
const STAGE_ADDR = 1;
const STAGE_UDP_ASSOC = 2;
const STAGE_DNS = 3;
const STAGE_CONNECTING = 4;
const STAGE_STREAM = 5;
const STAGE_DESTROYED = -1;

const STAGE = {
	[-1]: 'STAGE_DESTROYED',
	0: 'STAGE_INIT',
	1: 'STAGE_ADDR',
	2: 'STAGE_UDP_ASSOC',
	3: 'STAGE_DNS',
	4: 'STAGE_CONNECTING',
	5: 'STAGE_STREAM'
};

const SERVER_STATUS_INIT = 0;
const SERVER_STATUS_RUNNING = 1;
const SERVER_STATUS_STOPPED = 2;

var globalConnectionId = 1;
var clients = {};

function parseAddressHeader(data, offset) {
	var addressType = data.readUInt8(offset);
	var headerLen, dstAddr, dstPort, dstAddrLen;
	//domain name
	if (addressType == ADDRESS_TYPE_DOMAIN_NAME) {
		dstAddrLen = data.readUInt8(offset + 1);
		dstAddr = data.slice(offset + 2, offset + 2 + dstAddrLen).toString();
		dstPort = data.readUInt16BE(offset + 2 + dstAddrLen);
		headerLen = 4 + dstAddrLen;
	}
	//ipv4
	else if (addressType == ADDRESS_TYPE_IPV4) {
		dstAddr = data.slice(offset + 1, offset + 5).join('.').toString();
		dstPort = data.readUInt16BE(offset + 5);
		headerLen = 7;
	} else {
		return false;
	}
	return {
		addressType: addressType,
		headerLen: headerLen,
		dstAddr: dstAddr,
		dstPort: dstPort
	};
}

//class
class TCPRelay {
	constructor(password, method, server) {
		this.status = SERVER_STATUS_INIT;
		this.server = server;
		this.password = password;
		this.method = method;
		//this.encryptor = new Encryptor(password, method);
		this.logger = null;
		this.logLevel = 'error';
		this.logFile = null;
		this.serverName = null;
	}
	setLog(serverName, logLevel, logFile) {
		this.serverName = serverName;
		if (logLevel)
			this.logLevel = logLevel;
		if (logFile && !path.isAbsolute(logFile)) {
			logFile = process.cwd() + '/' + logFile;
		}
		this.logFile = logFile;
		return this;
	};
	initLogger() {
		if (this.logFile) {
			log4js.loadAppender('file');
			log4js.addAppender(log4js.appenders.file(this.logFile), this.serverName);
		}
		this.logger = log4js.getLogger(this.serverName);
		this.logger.setLevel(this.logLevel);
	};

	//server
	handleConnectionByServer(client) {
		var self = this;
		var logger = self.logger;
		//var encryptor = self.encryptor;
		var encryptor = new Encryptor(self.password, self.method);
		var stage = STAGE_INIT;
		var clientId = (globalConnectionId++) % MAX_CONNECTIONS;
		var proxy, addressHeader;
		var dataCache = [];
		//let heartbeat;

		//logger.info(`[${clientId}]: accept connection from client`);
		clients[clientId] = client;
		client.on('message', function (data) {
			try {
				data = encryptor.decrypt(data);
			} catch (_error) {
				e = _error;
				logger.error(e);
				if (proxy) {
					proxy.destroy();
				}
				if (client) {
					client.close();
				}
				return;
			}

			logger.debug(`[${clientId}]: read data[length = ${data.length}] from client at stage[${STAGE[stage]}]`);

			switch (stage) {
				case STAGE_INIT:
					if (data.length < 7) {
						stage = STAGE_DESTROYED;
						logger.error(`[${clientId}]: an error of client occured data.length < 7`);
						return client.close();
					}
					addressHeader = parseAddressHeader(data, 0);
					if (!addressHeader) {
						stage = STAGE_DESTROYED;
						logger.error(`[${clientId}]: an error of client occured addressHeader error`);
						return client.close();
					}
					clientId = clientId + " " + addressHeader.dstAddr + ":" + addressHeader.dstPort;

					logger.info(`[${clientId}]: connecting`);
					stage = STAGE_CONNECTING;

					/*client.on('pong', function () {
						logger.info(`[${clientId}]: client pong`);
					});
					heartbeat = setInterval(function ping() {
						if (client.readyState != WebSocket.OPEN) return;
						client.ping();
						logger.info(`[${clientId}]: ping`);
					}, 30000);*/
					proxy = net.createConnection({
						port: addressHeader.dstPort,
						host: addressHeader.dstAddr,
						allowHalfOpen: true
					}, function () {
						//logger.info(`[${clientId}]: connecting to proxy`);
						for (var i = 0, l = dataCache.length; i < l; ++i) {
							proxy.write(dataCache[i]);
							logger.debug(`[${clientId}]: write dataCache[length = ${dataCache.length}] to proxy`);
						}
						/*dataCache = Buffer.concat(dataCache);
						proxy.write(dataCache, function () {
							logger.debug(`[${clientId}]: write data[length = ${dataCache.length}] to proxy`);
							dataCache = null;
						});*/
						dataCache = null;
						stage = STAGE_STREAM;
					});

					proxy.on('data', function (data) {
						logger.debug(`[${clientId}]: read data[length = ${data.length}] from proxy`);
						if (client.readyState == WebSocket.OPEN) {
							//client.ping();
							proxy.pause();
							client.send(encryptor.encrypt(data), {
								binary: true
							}, function () {
								proxy.resume();
								logger.debug(`[${clientId}]: write data[length = ${data.length}] to client`);
							});
						}
					});
					proxy.on('end', function () {
						logger.info(`[${clientId}]: end event of proxy has been triggered`);
						stage = STAGE_DESTROYED;
						client.close();
					});
					proxy.on('close', function (hadError) {
						logger.info(`[${clientId}]: close event[had error = ${hadError}] of proxy has been triggered`);
						stage = STAGE_DESTROYED;
						client.close();
					});
					proxy.on('error', function (error) {
						logger.error(`[${clientId}]: an error of proxy occured`, error);
						stage = STAGE_DESTROYED;
						proxy.destroy();
						client.close();
					});

					if (data.length > addressHeader.headerLen) {
						dataCache.push(data.slice(addressHeader.headerLen));
					}
					break;

				case STAGE_CONNECTING:
					dataCache.push(data);
					break;

				case STAGE_STREAM:
					proxy.write(data, function () {
						logger.debug(`[${clientId}]: write data[length = ${data.length}] to proxy`);
					});
					break;
			}
		});
		client.on('close', function (code, reason) {
			logger.info(`[${clientId}]: close event[code = '${code}:${WSErrorCode[code]}'] of client has been triggered`);
			clients[clientId] = null;
			//if (heartbeat) clearInterval(heartbeat);
			proxy && proxy.destroy();
		});
		client.on('error', function (error) {
			logger.error(`[${clientId}]: an error of client occured`, error);
			client.terminate();
			clients[clientId] = null;
			//if (heartbeat) clearInterval(heartbeat);
			proxy && proxy.end();
		});
	};

	bootstrap() {
		this.initLogger();
		var self = this;
		return new Promise(function (resolve, reject) {
			var server = self.server;
			/*server = config.wsserver; new WebSocket.Server({
					host: address,
					port: port,
					perMessageDeflate: false,
					backlog: MAX_CONNECTIONS
				});*/
			server.on('connection', function (connection) {
				return self.handleConnectionByServer(connection);
			});

			server.on('error', function (error) {
				self.logger.fatal('an error of', self.serverName, 'occured', error);
				self.status = SERVER_STATUS_STOPPED;
				reject(error);
			});
			server.on('listening', function () {
				self.logger.info(self.serverName, 'is listening');
				self.status = SERVER_STATUS_RUNNING;
				resolve();
			});
		});
	};

	/*stop() {
		var self = this;
		var connId = null;
		return new Promise(function (resolve, reject) {
			if (self.server) {
				self.server.close(function () {
					resolve();
				});
	
				for (connId in clients) {
					if (clients[connId]) {
						clients[connId].terminate();
					}
				}
	
			} else {
				resolve();
			}
		});
	};*/
}
module.exports = TCPRelay;