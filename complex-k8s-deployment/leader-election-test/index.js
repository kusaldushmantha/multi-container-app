const http = require('http');
const keys = require('./keys');

let master = {};

const cb = (response) => {
  let data = '';
  response.on('data', (piece) => {
    data = data + piece;
  });
  response.on('end', () => {
    master = JSON.parse(data);
    console.log(master);
  });
};

const updateMaster = function updateMaster() {
  const req = http.get({
    host: keys.leaderHost,
    path: '/',
    port: keys.leaderPort,
  }, cb);

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  req.end();
};

updateMaster();
setInterval(updateMaster, 5000);

const www = http.createServer((request, response) => {
  response.writeHead(200);
  response.end(`Master is ${master.name}`);
});

www.listen(8080);