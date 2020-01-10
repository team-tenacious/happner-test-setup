var program = require("commander");
var path = require("path");
var executionPath = process.cwd();
var Mesh = require('happner-2');

program
  .version(require("../package.json").version)
  .option("-n, --mesh-name [name]", "Mesh name")
  .option("-p, --port [port]", "Port")
  .option("-w, --admin-password [password]", "Admin password")
  .parse(process.argv);

var config = {
  name: program.meshName || 'test-setup-mesh',
  happn: {
    port: program.port || 12358,
    secure: true,
    adminPassword: program.adminPassword || 'happn'
  },
  modules: {
    module: {
      instance: {
        method1: function($happn, callback) {
          $happn.emit('event1');
          callback(null, 'reply1');
        },
        method2: function($happn, callback) {
          $happn.emit('event2');
          callback(null, 'reply2');
        },
        webmethod1: function(req, res) {
          res.end('ok1');
        },
        webmethod2: function(req, res) {
          res.end('ok2');
        }
      }
    }
  },
  components: {
    component: {
      module: 'module',
      web: {
        routes: {
          webmethod1: 'webmethod1',
          webmethod2: 'webmethod2'
        }
      }
    }
  }
};

mesh = new Mesh();
mesh.initialize(config, function(err) {
  if (err) {
    console.log(`SERVER INIT ERROR: ${err.message}`);
    return console.log(err.stack);
  }
  mesh.start((err) => {
    if (err) {
      console.log(`SERVER START ERROR: ${err.message}`);
      return console.log(err.stack);
    }
    console.log(`SERVER STARTED OK, LISTENING ON PORT: ${config.happn.port}`);
  });
});
