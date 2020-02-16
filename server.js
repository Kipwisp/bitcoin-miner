const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();

var path = require("path");
var port = 8080; // port that the server will listen on

app.use(bodyParser.urlencoded({ extended: true }));

// PAGES
//-----------------------------------------------------------------------------------------------

app.get('/', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/main.html'));
});

// JAVASCRIPT
//-----------------------------------------------------------------------------------------------

app.get('/js/main.js', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/js/main.js'));
});

app.get('/js/worker.js', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/js/worker.js'));
});

app.get('/js/jquery.min.js', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/js/jquery.min.js'));
});

app.get('/js/jquery.color.js', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/js/jquery.color.js'));
});

app.get('/js/biginteger.min.js', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/js/biginteger.min.js'));
});

// CSS
//-----------------------------------------------------------------------------------------------

app.get('/css/style.css', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/css/style.css'));
});

// IMAGES
//-----------------------------------------------------------------------------------------------

app.get('/img/assets/up.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/assets/up.png'));
});

app.get('/img/assets/down.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/assets/down.png'));
});

app.get('/img/assets/neutral.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/assets/neutral.png'));
});

app.get('/img/assets/arrow.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/assets/arrow.png'));
});

app.get('/img/assets/title.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/assets/title.png'));
});

app.get('/img/assets/icon.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/assets/icon.png'));
});

app.get('/img/assets/load.gif', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/assets/load.gif'));
});

app.get('/img/canvas/rays_final.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/canvas/rays_final.png'));
});

app.get('/img/canvas/rays_large.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/canvas/rays_large.png'));
});

app.get('/img/canvas/rays_small.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/canvas/rays_small.png'));
});

app.get('/img/canvas/btc.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/canvas/btc.png'));
});

app.get('/img/canvas/coin.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/canvas/coin.png'));
});

app.get('/img/store/transistor.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/transistor.png'));
});

app.get('/img/store/pi.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/pi.png'));
});

app.get('/img/store/pentium.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/pentium.png'));
});

app.get('/img/store/gtx.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/gtx.png'));
});

app.get('/img/store/warehouse.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/warehouse.png'));
});

app.get('/img/store/botnet.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/botnet.png'));
});

app.get('/img/store/quantum.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/quantum.png'));
});

app.get('/img/store/alien.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/alien.png'));
});

app.get('/img/store/rift.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/rift.png'));
});

app.get('/img/store/shrine.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/shrine.png'));
});

app.get('/img/store/crystal.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/crystal.png'));
});

app.get('/img/store/matrix.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/matrix.png'));
});


app.get('/img/store/locked/transistor_locked.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/locked/transistor_locked.png'));
});

app.get('/img/store/locked/pi_locked.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/locked/pi_locked.png'));
});

app.get('/img/store/locked/pentium_locked.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/locked/pentium_locked.png'));
});

app.get('/img/store/locked/gtx_locked.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/locked/gtx_locked.png'));
});

app.get('/img/store/locked/warehouse_locked.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/locked/warehouse_locked.png'));
});

app.get('/img/store/locked/botnet_locked.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/locked/botnet_locked.png'));
});

app.get('/img/store/locked/quantum_locked.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/locked/quantum_locked.png'));
});

app.get('/img/store/locked/alien_locked.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/locked/alien_locked.png'));
});

app.get('/img/store/locked/rift_locked.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/locked/rift_locked.png'));
});

app.get('/img/store/locked/shrine_locked.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/locked/shrine_locked.png'));
});

app.get('/img/store/locked/crystal_locked.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/locked/crystal_locked.png'));
});

app.get('/img/store/locked/matrix_locked.png', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/img/store/locked/matrix_locked.png'));
});

// AUDIO
//-----------------------------------------------------------------------------------------------

app.get('/audio/coin1.wav', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/audio/coin1.wav'));
});

app.get('/audio/coin2.wav', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/audio/coin2.wav'));
});

app.get('/audio/coin3.wav', function (req, res) {
  res.sendfile(path.join(__dirname+'/client/audio/coin3.wav'));
});


// JSON
//-----------------------------------------------------------------------------------------------

app.post('/btc.json', function(req, res) {
  getBTCData(true, function(data) {
    res.json(data);
  });
});

app.post('/btc_yesterday.json', function(req, res) {
  getBTCData(false, function(data) {
    res.json(data);
  });
});

// get current price of bitcoin from coindesk API
function getBTCData(current, callback)
  {
    let url = '';
    
    if (current)
      url = `https://api.coindesk.com/v1/bpi/currentprice/USD.json`;
    else
      url = `https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday`;
    
    request(url, function (err, response, body) {
      if (err)
      {
         console.log("Error fetching BTC data.");
      }
      else
      {
         let data = JSON.parse(body);
         let processedData = 0;
         
         if (current)
         {
           try {
            processedData = Math.round(data.bpi.USD.rate_float*100);
           }
           catch(error) {
             console.log("Error fetching BTC data.");
           }
         }
         else
         {
          var date = new Date();
          date.setDate(date.getDate()-1);
          
          try {
            processedData = Math.round(data.bpi[date.getFullYear() + '-' + ("0"+(date.getMonth()+1)).slice(-2) + '-' + ("0"+date.getDate()).slice(-2)]*100);
          }
          catch(error) {
            console.log("Error fetching yesterday's BTC data.");
          }
         }
          
         callback(processedData);
      }
    });
  }
  
app.listen(port, function () {
  console.log('Bitcoin Miner listening on port ' + port + '.');
});
