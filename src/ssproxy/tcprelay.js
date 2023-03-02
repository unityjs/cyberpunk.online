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


//var connections = {};

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


function renderSize(value) {
	if (value > 1024)
		return (value / 1024).toFixed(1) + 'KB';
	return value + 'B';
}

function renderTime(value) {
	if (value > 1000) return (value / 1000).toFixed(1) + 's';
	return value + 'ms';
}
//class
class TCPRelay {
	constructor(config) {
		//this.config = require('./config.json');
		//if (config) {
		//this.config = Object.assign(this.config, config);
		//}
		this.config = config;
		this.logger = null;
		this.logLevel = 'error';
		this.logFile = null;
		this.serverName = null;
		this.globalConnectionId = 1;
	}
	setLog(serverName, logLevel, logFile) {
		this.serverName = serverName;
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
	/*decrypt(data) {
		return data;
	}
	encrypt(data) {
		return data;
	}*/
	handleConnectionByLocal(connection) {
		var logger = this.logger;
		var serverAddress = this.serverAddress;
		var stage = STAGE_INIT;
		var connectionId = (this.globalConnectionId++) % MAX_CONNECTIONS;
		var serverConnection;
		var canWriteToLocalConnection = true;
		var dataCache = [];

		var encryptor = new Encryptor(this.config.password, this.config.method);
		//logger.info(`[${connectionId}]: accept connection from client`);
		//connections[connectionId] = connection;
		connection.setKeepAlive(false);
		connection.on('data', function (data) {
			//logger.debug(`[${connectionId}]: read data[length = ${data.length}] from client connection at stage[${STAGE[stage]}]`);
			switch (stage) {
				case STAGE_INIT:
					if (data.length < 3 || data.readUInt8(0) != 5) {
						stage = STAGE_DESTROYED;
						return connection.end();
					}
					connection.write("\x05\x00");
					stage = STAGE_ADDR;
					break;

				case STAGE_ADDR:
					if (data.length < 10 || data.readUInt8(0) != 5) {
						stage = STAGE_DESTROYED;
						return connection.end();
					}
					var cmd = data.readUInt8(1);
					var addressHeader = parseAddressHeader(data, 3);
					if (!addressHeader) {
						stage = STAGE_DESTROYED;
						return connection.end();
					}
					connectionId = connectionId + " " + addressHeader.dstAddr + ":" + addressHeader.dstPort;

					//only supports connect cmd
					if (cmd != CMD_CONNECT) {
						logger.error('[${connectionId}]: only supports connect cmd');
						stage = STAGE_DESTROYED;
						return connection.end("\x05\x07\x00\x01\x00\x00\x00\x00\x00\x00");
					}

					logger.info(`[${connectionId}]: connecting`);
					connection.write("\x05\x00\x00\x01\x00\x00\x00\x00\x00\x00");

					stage = STAGE_CONNECTING;


					//let client = new net.Socket();
					serverConnection = new WebSocket(serverAddress, {
						perMessageDeflate: false
					});
					serverConnection.on('open', function () {
						//logger.info(`[${connectionId}]: connecting And Send`);
						serverConnection.send(encryptor.encrypt(data.slice(3)), function () {
							//var dataCacheLenth = 0;
							for (var i = 0, l = dataCache.length; i < l; ++i) {
								serverConnection.send(encryptor.encrypt(dataCache[i]), { binary: true });
								//dataCacheLenth += dataCache[i].length;
								logger.debug(`[${connectionId}]: Send dataCache[length = ${renderSize(dataCache[i].length)}]`);
							}
							//logger.info(`[${connectionId}]: connecting And Send dataCache[count = ${dataCache.length}, length = ${renderSize(dataCacheLenth)}]`);
							/*dataCache = Buffer.concat(dataCache);
							serverConnection.send(encryptor.encrypt(dataCache), {
								binary: true
							}, function () {
								logger.debug(`[${connectionId}]: write data[length = ${dataCache.length}] to client connection`);
							});*/
							dataCache = null;
							stage = STAGE_STREAM;
						});
					});
					serverConnection.on('message', function (data) {
						var decryptData = encryptor.decrypt(data);
						logger.debug(`[${connectionId}]: Accept data[length = ${renderSize(data.length)}]`);
						canWriteToLocalConnection && connection.write(decryptData, function () {
							//logger.debug(`[${connectionId}]: Accept data[length = ${data.length}] to client connection`);
						});
					});
					serverConnection.on('error', function (error) {
						logger.error(`[${connectionId}]: an error of server connection occured`, error);
						stage = STAGE_DESTROYED;
						connection.end();
					});
					serverConnection.on('close', function (code, reason) {
						logger.info(`[${connectionId}]: close event[code = '${WSErrorCode[code]}'] of server connection has been triggered`);
						stage = STAGE_DESTROYED;
						connection.end();
					});

					if (data.length > addressHeader.headerLen + 3) {
						dataCache.push(data.slice(addressHeader.headerLen + 3));
					}
					break;

				case STAGE_CONNECTING:
					dataCache.push(data);
					break;

				case STAGE_STREAM:
					var encryptData = encryptor.encrypt(data);

					canWriteToLocalConnection && serverConnection.send(encryptData, {
						binary: true
					}, function () {
						logger.debug(`[${connectionId}]: Send data[length = ${renderSize(data.length)}]`);
					});
					break;
			}
		});
		connection.on('end', function () {
			logger.info(`[${connectionId}]: end event of client connection has been triggered`);
			stage = STAGE_DESTROYED;
		});
		connection.on('close', function (hadError) {
			logger.info(`[${connectionId}]: close event[had error = ${hadError}] of client connection has been triggered`);
			stage = STAGE_DESTROYED;
			canWriteToLocalConnection = false;
			//connections[connectionId] = null;
			serverConnection && serverConnection.terminate();
		});
		connection.on('error', function (error) {
			logger.error(`[${connectionId}]: an error of client connection occured`, error);
			stage = STAGE_DESTROYED;
			connection.destroy();
			canWriteToLocalConnection = false;
			//connections[connectionId] = null;
			serverConnection && serverConnection.close();
		});
	};
	handleConnectionByRemote(connection) {
		var logger = this.logger;
		var serverAddress = this.serverAddress;
		var stage = STAGE_INIT;
		var connectionId = (this.globalConnectionId++) % MAX_CONNECTIONS;
		var serverConnection;
		var canWriteToLocalConnection = true;
		var dataCache = [];

		//logger.info(`[${connectionId}]: accept connection from client`);
		//connections[connectionId] = connection;
		connection.setKeepAlive(false);
		connection.on('data', function (data) {
			//logger.debug(`[${connectionId}]: read data[length = ${data.length}] from client connection at stage[${STAGE[stage]}]`);
			switch (stage) {

				case STAGE_INIT:
					stage = STAGE_CONNECTING;
					serverConnection = new WebSocket(serverAddress, {
						perMessageDeflate: false
					});
					serverConnection.on('open', function () {
						logger.info(`[${connectionId}]: connecting to server`);
						//serverConnection.send(data, function () {
						stage = STAGE_STREAM;
						dataCache = Buffer.concat(dataCache);
						serverConnection.send(dataCache, {
							binary: true
						}, function () {
							logger.debug(`[${connectionId}]: write data[length = ${dataCache.length}] to client connection`);
							dataCache = null;
						});
						//});
					});
					serverConnection.on('message', function (data) {
						logger.debug(`[${connectionId}]: read data[length = ${data.length}] from server connection`);
						canWriteToLocalConnection && connection.write(data, function () {
							logger.debug(`[${connectionId}]: write data[length = ${data.length}] to client connection`);
						});
					});
					serverConnection.on('error', function (error) {
						logger.error(`[${connectionId}]: an error of server connection occured`, error);
						stage = STAGE_DESTROYED;
						connection.end();
					});
					serverConnection.on('close', function (code, reason) {
						logger.info(`[${connectionId}]: close event[code = '${WSErrorCode[code]}'] of server connection has been triggered`);
						stage = STAGE_DESTROYED;
						connection.end();
					});

					dataCache.push(data);
					break;

				case STAGE_CONNECTING:
					dataCache.push(data);
					break;

				case STAGE_STREAM:
					canWriteToLocalConnection && serverConnection.send(data, {
						binary: true
					}, function () {
						logger.debug(`[${connectionId}]: Send data[length = ${data.length}] to server connection`);
					});
					break;
			}
		});
		connection.on('end', function () {
			logger.info(`[${connectionId}]: end event of client connection has been triggered`);
			stage = STAGE_DESTROYED;
		});
		connection.on('close', function (hadError) {
			logger.info(`[${connectionId}]: close event[had error = ${hadError}] of client connection has been triggered`);
			stage = STAGE_DESTROYED;
			canWriteToLocalConnection = false;
			//connections[connectionId] = null;
			serverConnection && serverConnection.terminate();
		});
		connection.on('error', function (error) {
			logger.error(`[${connectionId}]: an error of client connection occured`, error);
			stage = STAGE_DESTROYED;
			connection.destroy();
			canWriteToLocalConnection = false;
			//connections[connectionId] = null;
			serverConnection && serverConnection.close();
		});
	};
	// 远程映射
	startServer(port, serverAddress, handleConnection) {
		this.serverAddress = serverAddress;
		this.initLogger();
		var self = this;
		return new Promise(function (resolve, reject) {
			var server = net.createServer({ allowHalfOpen: true, });
			server.maxConnections = MAX_CONNECTIONS;
			server.on('connection', function (connection) { return handleConnection.call(self, connection); });
			server.on('close', function () {
				self.logger.info('server is closed');
			});
			server.listen(port);//, config.localAddress);
			server.on('error', function (error) {
				self.logger.fatal('an error of server occured', error);
				reject(error);
			});
			server.on('listening', function () {
				var addressInfo = server.address();
				self.logger.info('Server is listening on', addressInfo.address + ':' + addressInfo.port);
				resolve();
			});
		});
	};
}


module.exports.TCPRelay = TCPRelay;