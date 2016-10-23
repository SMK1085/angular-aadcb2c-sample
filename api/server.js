var express = require('express');
var app = express();
var api = require('./routes/api');

app.get('/api/v1/discovery/keys', api.discoverykeys);

var httpServer = http.createServer(app);
httpServer.listen(8701);