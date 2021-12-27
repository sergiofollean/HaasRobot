const express = require("express");
const app = express();
const port = process.env.PORT || 81;
const cors = require('cors');
const axios = require("axios");
var fs = require('fs');
var http = require('http');
var https = require('https');

var privateKey  = fs.readFileSync("/etc/letsencrypt/live/sota-api.gq/privkey.pem", 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/sota-api.gq/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/sota-api.gq/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

app.use(cors({
    origin: '*'
}));

app.get('/GetPriceMarkets/:platform', (req, res) => {
  var platform = req.params.platform;

  axios
    .get('http://127.0.0.1:8095/GetPriceMarkets?priceSourceName='+platform)
    .then(response => {
      res.send(response.data.Result);
    });
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(port);
httpsServer.listen(443);
console.log('server is up');

// app.listen(port, () => {
//   console.log(`API Server at http://localhost:${port}`)
// })
