var express = require('express');
const WebSocket = require('ws');

var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser')
//var session = require('express-session');
var cors = require('cors');
var serveStatic = require('serve-static')
var vhost = require('vhost');
//var libqqwry = require('lib-qqwry');
//var qqwry = libqqwry() //初始化IP库解析器
//qqwry.speed(); //启用急速模式;

var fs = require('fs');
var parseUrl = require('parseurl')

console.log('Node app is running!');
var url = require('url');
var urlList = {};
recordURL = function (req, res, next) {
  var host = req.headers.host;
  if (!host) return;
  var path = host + url.parse(req.url).pathname;

  if (path in urlList) urlList[path]++;
  else urlList[path] = 1;
  return next();
}

let filesMtimes = {};

var CryptoJS = require('crypto-js');
function getAesString(data, key, iv) {//加密
  let srcs = CryptoJS.enc.Utf8.parse(data);
  var key = CryptoJS.enc.Utf8.parse(key);
  var iv = CryptoJS.enc.Utf8.parse(iv);
  var encrypted = CryptoJS.AES.encrypt(srcs, key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  return encrypted.toString();    //返回的是base64格式的密文
}
function getAES(data) { //加密
  var key = 'w8m31+Yy/Nw6thPsMpO5fg==';  //密钥
  var iv = '1234567812345678';
  var encrypted = getAesString(data, key, iv); //密文
  //var encrypted1 = CryptoJS.enc.Utf8.parse(encrypted);
  return encrypted;
}
function getDAesString(encrypted, key, iv) {//解密
  var key = CryptoJS.enc.Utf8.parse(key);
  var iv = CryptoJS.enc.Utf8.parse(iv);
  var decrypted = CryptoJS.AES.decrypt(encrypted, key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
function getDAes(data) {//解密
  var key = 'w8m31+Yy/Nw6thPsMpO5fg==';  //密钥
  var iv = '1234567812345678';
  var decryptedStr = getDAesString(data, key, iv);
  return decryptedStr;
}

encodeRes = function (root, options) {
  let encodeRoot = root + "/encode";
  let before = serveStatic(encodeRoot, options)
  if (!fs.existsSync(encodeRoot))
    fs.mkdirSync(encodeRoot);
  return function (req, res, next) {
    var path = parseUrl(req).pathname;
    var srcFile = './' + root + path;
    if (fs.existsSync(srcFile)) {
      let stat = fs.statSync(srcFile);
      var mtime = stat.mtime.getTime();
      if (stat.isFile() && filesMtimes[path] != mtime) {
        var destFile = './' + encodeRoot + path;
        var data = fs.readFileSync(srcFile);
        var fd = fs.openSync(destFile, 'w');
        fs.writeSync(fd, getAES(data));
        fs.closeSync(fd);
        filesMtimes[path] = mtime;
      }
    }
    return before(req, res, next);
  }
}

var routerAutojs = express.Router();
var app = express();
app.set('port', (process.env.PORT || 5000));
//app.use(cookieParser('secret2019'));
/*app.use(session({
  secret: 'secret', // 对session id 相关的cookie 进行签名
  name: '_sid',
  resave: true,
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(vhost('w.soulgame.cn', routerAutojs));
app.use(recordURL);
app.use(serveStatic('public/soulgame.cn'));
routerAutojs.use(encodeRes('public/autojs'));

server = app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

require('./matches.js')(app);
//require('./bot.js')(app);
//require('./gameAnalytics.js')(app, app);
require('./route.js')(app);// url代理

app.get('/logs', function (req, res) {
  res.json({ success: true, data: urlList });
});

/*var app2 = express();
app2.set('port', 8080);
app2.use(bodyParser.json());
app2.use(cors());
app2.use(serveStatic('public'));

app2.listen(app2.get('port'), function() {
  console.log('Websocket is running on port', app2.get('port'));
});*/

const wss = new WebSocket.Server({ server });
console.log("WebSocket ok");
const TCPRelay = require('./wsss/tcprelay');
var relay = new TCPRelay('wasduijk', 'aes-256-cfb', wss);
//relay.setLogLevel('info');
//relay.setLogFile(server.logFile);
relay.setLog('wsss');
relay.bootstrap();

// Export the Express API
module.exports = app;