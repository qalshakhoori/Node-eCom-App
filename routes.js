const fs = require('fs');

const requestHandler = (req, res) => {
  const { url, method } = req;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first page</title></head>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message" /> <input type="submit" value="Submit" /> </form></body>'
    );
    res.write('<html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => body.push(chunk));

    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, (error) => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My first page</title></head>');
  res.write('<body>Hello from my Node.js Server</body>');
  res.write('<html>');
  res.end();
};

module.exports = requestHandler;
