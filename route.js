const express = require('express');
const http = require('http');
const https = require('https');
const urlib = require("url");

function toUnicode(str) {
    let unicode = '';
    for (let i = 0; i < str.length; i++) {
        let temp = str.charCodeAt(i);
        if (temp > 127) unicode += '\\u' + temp.toString(16);
        else unicode += str.charAt(i);
    }
    return unicode;
}

function getXFF(req) {
    let xff = req.header("x-forwarded-for");
    let curIP = req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (xff && xff.length > 0) xff += "," + curIP;
    else xff = curIP;
    return xff;
}

module.exports = function (app) {
    let router = express.Router();
    router.all('/', function (req, res, next) {
        try {
            let options = urlib.parse("https://api.unityjs.net" + req.originalUrl, true);
            options.method = req.method;
            options.headers = { "x-forwarded-for": getXFF(req) };
            let content = null;
            if (req.method == "POST") {
                content = toUnicode(JSON.stringify(req.body));
                options.headers['Content-Type'] = 'application/json';//'multipart/form-data'//根据提交请求类型不同而不同，以上适用多媒体文件 //可查询各种报头类型代表的意思
                options.headers['Content-Length'] = content.length;
            }
            let request = (options.protocol == "https:" ? https : http).request(options, function (response) { response.pipe(res); });
            if (content) request.write(content);
            request.end();
        } catch (e) {
            console.error(e);
            res.send(e);
        }
    });
    app.use('/g/*', router);

    let routerHttp = express.Router();
    routerHttp.all('/', function (req, res, next) {
        try {
            let options = urlib.parse(req.originalUrl.replace(/\/(http[s]?)\//, '$1://'), true);
            options.method = req.method;
            options.headers = { "x-forwarded-for": getXFF(req) };
            let content = null;
            if (req.method == "POST") {
                content = toUnicode(JSON.stringify(req.body));
                options.headers['Content-Type'] = 'application/json';//'multipart/form-data'//根据提交请求类型不同而不同，以上适用多媒体文件 //可查询各种报头类型代表的意思
                options.headers['Content-Length'] = content.length;
            }
            let request = (options.protocol == "https:" ? https : http).request(options, function (response) { response.pipe(res); });
            if (content) request.write(content);
            request.end();
        } catch (e) {
            console.error(e);
            res.send(e);
        }
    });
    app.use('/http/*', routerHttp);
    app.use('/https/*', routerHttp);
}