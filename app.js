var express = require('express');
var app = express();
var api = require('./routes/api');

app.use("/js", express.static(__dirname + "/public/js"));
app.use("/images", express.static(__dirname + "/public/images"));
app.use("/css", express.static(__dirname + "/public/css"));

app.use('/api', api);

app.get('/', function (req, res) {
  res.sendfile(__dirname +'/public/index.html'); 
})

app.get('/:file', function (req, res) {
  res.sendfile(__dirname + '/public/' + req.params.file + '.html'); 
})

//Server init
var server = app.listen(5000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})

