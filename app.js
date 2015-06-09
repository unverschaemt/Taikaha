var fs = require('fs');

var hostFolder = process.argv[2];
var listenFile = process.argv[3];
var port = 7777;
if (process.argv[4]) {
	port = parseInt(process.argv[4]);
}

var sio = fs.readFileSync(__dirname + '/node_modules/socket.io/node_modules/socket.io-client/socket.io.js');

sio += "var socket = io(); socket.on('change', function (data) {window.location.reload(false); });";

var express = require('express');

var app = express()

app.set('port', port);

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.use(express.static(__dirname+hostFolder));

app.get('/taikaha.js', function(req, res) {
	res.append('Content-Type', 'application/javascript');
	res.send(sio);
});


var server = app.listen(app.get('port'), function() {
	console.log("STARTED SERVER! PORT: ", app.get('port'));
});
var io = require('socket.io')(server);

io.on('connection', function(socket) {
	console.log('Socket connected!');
});


fs.watchFile(__dirname+listenFile, function() {
	console.log('Something Changed!');
	io.emit('change', '');
})

