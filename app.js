const express = require('express');
const app = express();

app.use(express.static('static'))

var server = app.listen(8080, function() {
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
    socket.on('newUser', function(name) {
        console.log(name)
        userList.push(name)
        socket.name = name
        io.sockets.emit('logIn', userList, name)
    })
    socket.on('message', function(msg) {
        console.log(`收到了：${msg}`)
        var user = socket.name
        var message = [user, msg]
        socket.broadcast.emit('message', message)
    })
    socket.on('disconnect', () => {
        console.log('有人离开了')
        var name = socket.name
        userList.splice(userList.indexOf(name), 1)
        socket.broadcast.emit('logOut', name)
    })
    socket.on('image', function(img) {
        var user = socket.name
        var message = [user, img]
        socket.broadcast.emit('image', message)
    })
})
