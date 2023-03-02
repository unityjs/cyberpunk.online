const TCPRelay = require('./tcprelay').TCPRelay;
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
    .parse(process.argv);*/

var config = {
    password: 'wasduijk',
    method: 'aes-256-cfb'
}
var serverAddress = 'ws://185.199.224.214:80';//'wss://unityjs.herokuapp.com:443'; 'ws://45.195.134.30:80'

var relay = new TCPRelay(config);
relay.setLog('Proxy', 'debug'/*, './proxy.txt'*/);
relay.startServer(9080, serverAddress, relay.handleConnectionByLocal);

relay = new TCPRelay(config);
relay.setLog('Remote', 'info', './remote.txt');
relay.startServer(8388, serverAddress, relay.handleConnectionByRemote);