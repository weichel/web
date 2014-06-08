global.window = global.document = global;

global.config = require ('./config').values;

var port = parseInt(process.argv[2], 10) || config.server.port;


require('./web');
require("./db");



var database = new Database("Main",["users"]);
var web = new Web();


web.start(port, database);


process.on('SIGINT', function () {
	web.http.server.close();
	console.log();
	console.log('Shutting down server..');
	process.exit(0);
});

