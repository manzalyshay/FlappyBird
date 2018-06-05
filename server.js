// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});
// Starts the server.
server.listen(5000, function() {
    console.log('Starting server on port 5000');
});

var players = {};
io.on('connection', function(socket) {
    socket.on('newplayer', function() {
        players[socket.id] = {
            score: 0
        };
    });

    socket.on('updatescore', function(data) {
        var player = players[socket.id] || {};
        player.score += data;
    });


});
setInterval(function() {
    io.sockets.emit('state', players);
}, 1000 / 5);