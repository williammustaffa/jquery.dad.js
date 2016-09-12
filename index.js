var express = require('express');
var path = require('path');
var app = express();

// Define the port to run on
app.set('port', 3000);

app.use('/source', express.static(path.join(__dirname, 'source')));
app.use(express.static(path.join(__dirname, 'demo')));

// Listen for requests
var server = app.listen(app.get('port'), function () {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});
