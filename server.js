const http = require('http');
const webSocketServer = require('websocket').server;


const PORT = process.env.PORT || 3000;

const server = http.createServer();
server.listen(PORT, () => console.log(`listening on port ${PORT}`));


const wsServer = new webSocketServer({
  httpServer: server,
});

const clients = [];

wsServer.on('request', function (request) {
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');

  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);

  clients.push(connection);

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ', message.utf8Data);

      // broadcasting message to all connected clients
      clients.forEach(client => client.sendUTF(message.utf8Data));
    }
  })
});
