var app = require('express')();
var logger = require('morgan');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var PubNub = require('pubnub');

var PythonShell = require('python-shell');
var pyshell = new PythonShell('BMP280.py');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(logger('dev'));

app.set('port', process.env.PORT || 3000);

var localPubnub = new PubNub({publishKey: 'PUBNUBPUBLISHKEY', subscribeKey: 'PUBNUBSUBSCRIBEKEY'})

pyshell.on('message', function(message) {

    var split = message.split(",");
    //console.log(split[0]) // Temperature
    //console.log(split[1]) // Humidity

    var publishMessage = {
      channel: "sensor_data",
      message: split
    }

    localPubnub.publish(publishMessage, function(status, response) {
      console.log(status, response);
    })

})

localPubnub.addListener({
    status: function(statusEvent) {
      if (statusEvent.category === "PNConnectedCategory") {
        console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
      }
    },
    message: function(message) {
      console.log("New Message!!", message);
    },
    presence: function(presenceEvent) {
      // handle presence
    }
})

localPubnub.subscribe({channels: ['sensor_data']});

http.listen(app.get('port'), function() {
    console.log("App is listening on " + app.get('port'));
})
