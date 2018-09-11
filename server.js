require('dotenv').config({ silent: true });

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const http = require('http');
const moment = require('moment-timezone');
const serialize = require('serialize-javascript');

moment.locale('pt-br');
moment.tz.setDefault('UTC');
let renderer;

app.use('/public', express.static(path.join(__dirname, 'public')));

// for production mode
if (process.env.NODE_ENV === 'production') {
  let bundle = fs.readFileSync('./dist/node.bundle.js', 'utf-8');
  renderer = require('vue-server-renderer').createBundleRenderer(bundle);
  app.use('/dist', express.static(path.join(__dirname, 'dist')));
}
let events = [
  { description: 'event', date: moment(moment()) },
  { description: 'event', date: moment(moment().subtract(1, 'days')) },
  { description: 'event', date: moment(moment().add(1, 'month')) },
];

app.get('/', (req, res) => {
  let template = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
  let contentMarker = '<!--APP-->';
  if (renderer) {
    renderer.renderToString({ events }, (err, html) => {
      if (err) {
        console.log(err);
      } else {
        res.send(
          template.replace(
            contentMarker,
            `<script>var __INITIAL_STATE__ = ${serialize(
              events
            )}</script>${html}`
          )
        );
      }
    });
  } else {
    res.send(
      '<p>Awaiting Compilation..</p><script src="/reload/reload.js"></script>'
    );
  }
});

app.use(require('body-parser').json());
app.post('/addEvent', (req, res) => {
  events.push({
    description: req.body.description,
    date: moment(req.body.date),
  });
  res.sendStatus(200);
});

const server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
  const reload = require('reload');
  const reloadServer = reload(server, app);
  require('./webpack-dev-middleware').init(app);
  require('./webpack-server-compiler').init(function(bundle) {
    let needsReload = renderer === undefined;
    if (needsReload) {
      reloadServer.reload();
    }
    renderer = require('vue-server-renderer').createBundleRenderer(bundle);
  });
}

server.listen(process.env.PORT, function() {
  console.log(`Example app listening on port ${process.env.PORT}!`);
  if (process.env.NODE_ENV === 'development') {
    require('open')(`http://localhost:${process.env.PORT}`);
  }
});
