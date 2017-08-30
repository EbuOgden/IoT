var express = require('express');
var logger = require('morgan');
var fs = require('fs');
var exec = require('child_process').exec;

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public')); // Serve the html,js and css files from this directory.

app.get('/', function(req, res) {
  fs.readFile('./public/index.html', function(err, html) {
    if (err) {
      console.log("File Read Error", err);
    } else {

      res.write(html);
      res.end();

    }

  })
})

app.post('/lightOn', function(req, res) {

  try {
    exec("idle -r lightOn.py");
    setTimeout(function() {
      res.end()
    }, 1500);

  } catch (err) {
    console.log(err.stdout);
    console.log(err.stderr);
    console.log(err.pid);

  }

});

app.post('/lightOff', function(req, res) {

  try {
    exec("idle -r lightOff.py");
    setTimeout(function() {
      res.end()
    }, 1500);

  } catch (err) {
    console.log(err.stdout);
    console.log(err.stderr);
    console.log(err.pid);

  }

});

app.listen(app.get('port'), function() {
  console.log("App is listening on " + app.get('port'));
})
