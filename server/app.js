var express = require('express');
var app = express();
var mcache = require('memory-cache');
var proxy = require('./proxy');


var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

app.get('/', (req, res) => {
  res.send('ok');
})

app.use('/search/', (req, res) => {
  console.log('req ',req.headers.origin);
  //todo move to proxy
  if (req.headers.origin === 'http://localhost:3000') {
    proxy.ounassProxy(req, res);
  } else if (req.headers.origin === 'http://localhost:3001'){
    proxy.mamasProxy(req, res);
  } else {
    res.status(403).send('');
  }
});

app.use((req, res) => {
  res.status(404).send('') //not found
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
});
