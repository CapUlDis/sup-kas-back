const http = require('http');
const webSocketServer = require('websocket').server;
const { Phone } = require('./models');


const PORT = process.env.PORT || 3000;

const server = http.createServer();
server.listen(PORT, () => console.log(`listening on port ${PORT}`));


const wsServer = new webSocketServer({
  httpServer: server,
});

const clients = [];

wsServer.on('request', async (request) => {
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');

  const connection = request.accept(null, request.origin);
  clients.push(connection);

  const Phones = await Phone.findAll({ attributes: ['phone'] })
    .then(data => data.map(item => item.phone));

  connection.send(JSON.stringify({ list: Phones }));

  connection.on('message', async (message) => {
    if (message.type === 'utf8') {
      const data = JSON.parse(message.utf8Data);

      const newPhone = await Phone.create({ phone: data.msg });

      clients.forEach(client => client.send(JSON.stringify({ newPhone: newPhone.phone })));
    }
  })
});
