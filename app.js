const express = require('express');
const app = express();

var server = app.listen(9000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

var sendHtml = function(path, response) {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    fs.readFile(path, options, function(err, data) {
        response.send(data)
    })
}

app.get('/', function(req, res) {
    var path = 'index.html'
    sendHtml(path, res)
})

var userList = []

io = require('socket.io').listen(server)
io.on('connection', function(socket) {
    console.log('新用户连接成功')
    socket.emit('whoAreYou')
    socket.on('name', function(name) {
        console.log(name)
        userList.push(name)
        socket.name = name
    })
    socket.emit('message', '你登陆了')
    socket.on('message', function(msg) {
        console.log(`收到了：${msg}`)
        var user = socket.name
        var msg = `${user}: ${msg}`
        io.sockets.emit('message', msg)
    })
    socket.on('disconnect', () => {
        console.log('有人离开了')
        userList.splice(userList.indexOf(socket.name), 1)
        socket.broadcast.emit('message', `${socket.name} 已经离开`)
    })
})