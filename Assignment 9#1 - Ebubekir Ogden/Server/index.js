var app = require('express')();
var logger = require('morgan');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var async = require('async');

var cassandra = require('cassandra-driver');

var PythonShell = require('python-shell');
var pyshell = new PythonShell('BMP280.py');

var config = {
  databaseLogin: "127.0.0.1",
  databaseKeyspace: "sensor"
}

var cassandraClient = new cassandra.Client({
  contactPoints: [config.databaseLogin],
  keyspace: [config.databaseKeyspace]
});
var cassandraUUID = cassandra.types.Uuid;

var InsertData = "INSERT INTO sensor_data(id, temperature, humidity, date) VALUES(?, ?, ?, ?)";

var GetData = "SELECT * FROM sensor_data LIMIT 1";

app.use(bodyParser.json());

app.use(logger('dev'));

app.set('port', process.env.PORT || 3000);

io.on('connection', function(socket) {
    console.log("a user connected");

    socket.on('getData', function() {
      pyshell.on('message', function(message) {

        var split = message.split(",");
        async.waterfall([
            function InsertData(callback) {
                var date = new Date()
                cassandraClient.execute("INSERT INTO sensor_data(id, temperature, humidity, date) VALUES(?, ?, ?, ?)", [
                  '345317c8-a5a3-45f8-bc7f-4d3308b70e28', split[0], split[1], date
                ], function(err, result) {
                      if (err) {
                        console.log("Error Has Occured! My Error is : ", err);
                      } else {
                        callback(null);
                      }
                })
            },

            function GetData(callback) {
                cassandraClient.execute("SELECT * FROM sensor_data LIMIT 1 ALLOW FILTERING", [], {
                  prepare: true
                }, function(err, result) {
                    if (err) {
                      console.log("Error Has Occured!", err);
                    } else {
                      callback(null, result.rows[0]);
                    }
                })

            }
        ], function(err, result) {
            if (err) {
                console.log("Waterfall Callback, Error:", err);
            } else {
                socket.emit('data', result);
            }
        })

      })

    })
})

http.listen(app.get('port'), function() {
    console.log("App is listening on " + app.get('port'));
})
