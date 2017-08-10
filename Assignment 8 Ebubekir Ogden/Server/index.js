var app = require('express')();
var logger = require('morgan');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var PythonShell = require('python-shell');
var pyshell = new PythonShell('BMP280.py');

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));

app.use(logger('dev'));

app.set('port', process.env.PORT || 3000);
//app.use(express.static(__dirname + '/public')); // Server the html,js and css files from this directory.

io.on('connection', function(socket) {
	  console.log("a user connected");

	  socket.on('getData', function() {
	    pyshell.on('message', function(message) {

		      var split = message.split(",");
		      //console.log(split[0]) // Temperature
		      //console.log(split[1]) // Humidity
		      socket.emit('data', split);
	    })

	    pyshell.end(function(err) {

	      	console.log(split);
	    })
	  })
})

app.post('/lightSetting', function(req, res) {

	  var body = req.body;

	  if (body.lightTurn) {
		    var pyshell = new PythonShell('lightOn.py');
		    res.json({"lightStatus": "On", "image": true})
	  } else {
		    var pyshell = new PythonShell('lightOff.py');
		    res.json({"lightStatus": "Off", "image": false})
	  }
})

http.listen(app.get('port'), function() {
  	console.log("App is listening on " + app.get('port'));
})
