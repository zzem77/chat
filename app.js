var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.use('/static', express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var sendLimit = {};

io.on('connection', function (socket) {
    socket.on('chat', function (msg) {
        if (typeof sendLimit[socket.id] === 'undefined') {
            sendLimit[socket.id] = 0;
        } else {
            sendLimit[socket.id]++;
        }

        io.emit('chat', msg);
        if (sendLimit[socket.id] && sendLimit[socket.id] > 9) {
            io.emit('limited');
        } else {
            io.emit('chat message', msg);
        }
    });
});

http.listen(process.env.PORT || 3000, function (req, res) {
    console.log('listen on 3000');
});