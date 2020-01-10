var program = require("commander");
var Mesh = require('happner-2');

program
  .version(require("../package.json").version)
  .option("-n, --mesh-name [name]", "Mesh name")
  .option("-h, --host [host]", "Host")
  .option("-p, --port [port]", "Port")
  .option("-w, --admin-password [password]", "Admin password")
  .parse(process.argv);

let config = {
  host: program.host || '127.0.0.1',
  port: program.port || 12358,
  username: '_ADMIN',
  password: program.adminPassword || 'happn'
};

let meshName = program.meshName || 'test-setup-mesh';

let client = new Mesh.MeshClient({
  host: config.host,
  port: config.port
});

client.login({
  username: config.username,
  password: config.password
})
.then((err) => {
  if (err) {
    console.log(`CLIENT INIT ERROR: ${err.message}`);
    return console.log(err.stack);
  }
  console.log(`CLIENT LOGGED IN OK, CONNECTED TO PORT: ${config.port}`);

  console.log(client.event);

  client.event[meshName].component.on('event1', () => {
      console.log(`CLIENT RAN METHOD1, HANDLING EVENT: ${new Date().toString()}`);
  });

  setInterval(() => {
    client.exchange[meshName].component.method1(() => {
      console.log(`CLIENT RAN METHOD1: ${new Date().toString()}`);
    });
  }, 1000);
});
