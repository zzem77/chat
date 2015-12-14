var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var sendLimit = {};

io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        if (typeof sendLimit[socket.id] === 'undefined') {
            sendLimit[socket.id] = 0;
        } else {
            sendLimit[socket.id]++;
        }

        if (sendLimit[socket.id] && sendLimit[socket.id] > 2) {
            io.emit('limited');
            return false;
        }

        io.emit('chat message', msg);
    });
});

http.listen(process.env.PORT || 3000, function (req, res) {
    console.log('listen on 3000');
});