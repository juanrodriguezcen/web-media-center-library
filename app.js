var express = require('express');
var app = express();
var api = require('./routes/api');

app.use('/api', api);

app.use(express.static(__dirname + '/public'));

//Server init
var server = app.listen(5000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})

