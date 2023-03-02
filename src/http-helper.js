var http = require('http');
var https = require('https');
const urlib = require("url");

function toUnicode(str) {
    var unicode = '';
    for (var i = 0; i < str.length; i++) {
        var temp = str.charCodeAt(i);
        if (temp > 127) unicode += '\\u' + temp.toString(16);
        else unicode += str.charAt(i);
    }
    return unicode;
}

module.exports = {
    httpGet: function (options, callback) {
        if (typeof (options) == 'string') options = urlib.parse(options,true);
        (options.protocol=="https:" ? https : http).get(options, function (res) {
            var body = [];
            res.on('data', function (chunk) {
                body.push(chunk);
            });
            res.on('end', function () {
                body = Buffer.concat(body);
                if (callback) callback(body);
            });
        });
    },
    httpPost: function (options, data, callback) {
        if (typeof (options) == 'string') options = urlib.parse(options,true);
        data = data || {};
        content = toUnicode(JSON.stringify(data));
        options.method = 'POST';
        if(!options.headers) options.headers={};
        if(!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json'//'multipart/form-data'//根据提交请求类型不同而不同，以上适用多媒体文件 //可查询各种报头类型代表的意思
        if(!options.headers['Content-Length']) options.headers['Content-Length'] = content.length
        var req = (options.protocol=="https:" ? https : http).request(options, function (res) {
            var _data = '';
            res.on('data', function (chunk) {
                _data += chunk;
            });
            res.on('end', function () {
                //if (_data.indexOf("4000") != -1) {
                //    callback(_data + content);
                //} else
                if (callback) callback(_data);
            });
        });
        req.write(content);
        req.end();
    }
}