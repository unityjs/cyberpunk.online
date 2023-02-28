
net = require("net");
var client = net.connect({ port: 6000, host: 'unityjs.herokuapp.com' }, function () {
    client.name = '客户机1';//unityjs.herokuapp.com
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    client.write(client.name + ' 上线了！\n');
    client.on("data", function (data) {
        console.log(data.toString());
    });
    process.stdin.on('data', function (data) {
        if (data == "FUCKexit") client.end(client.name + ' 下线了！\n');
        else
            client.write(data);
    })
    client.on('end', function () {
        console.log('【本机提示】退出聊天室');
        process.exit();
    });
    client.on('error', function () {
        console.log('【本机提示】聊天室异常');
        process.exit();
    });
});