const http = require('http');

const server = http.createServer((req, res) => {
  if (req.headers.authorization) {
    const authInfo = req.headers.authorization;
    const keyInfo = new Buffer(authInfo.slice(6), 'base64').toString();
    const user = keyInfo.split(':')[0];
    const pwd = keyInfo.split(':')[1];
    console.log(user, pwd);
    if (user === '123' && pwd === 'abc') {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Welcome');
      return;
    }
  }
  res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
  res.writeHead(401, {'Content-Type': 'text/plain'});
  res.end('Not Authorization');
});

server.listen(2333);
