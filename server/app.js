var express = require('express');
var app = express();
var mcache = require('memory-cache');
var proxy = require('./proxy');


var cache = (duration) => {
  return (req, res, next) => {
    let key = req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      console.log('cached....')
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

var proxyFactory = (req, res) => {
  if (req.headers.origin === 'http://localhost:3000') {
    proxy.ounassProxy(req, res);
  } else if (req.headers.origin === 'http://localhost:3001'){
    proxy.mamasProxy(req, res);
  } else {
    res.status(403).send('');
  }
},
logProxy = (req, res) => {
  console.log(req.url)
  if (req.url === '/logo_en.svg') {
    proxy.ounassProxy(req, res);
  } else if (req.url === '/logo_en_ae.png'){
    proxy.mamasProxy(req, res);
  } else {
    res.status(403).send('');
  }
};

app.get('/', (req, res) => {
  res.send('ok');
})

app.use('/search/', cache(60), proxyFactory);
app.use('/colors/', cache(60), proxyFactory);
app.use('/img/', cache(60), logProxy);

app.use((req, res) => {
  res.status(404).send('') //not found
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
});
