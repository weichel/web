
var Web = function(){
	this.database;
};

//Start both HTTP Server and Socket.io Server
Web.prototype.start = function(port, database){
	this.init_http(port);
	this.database = database;
	console.log("\tweb.js - http/socket server listening on port " + port );
	
}

Web.prototype.init_http = function(port){

	
	var self = this;
	var express = require('express')
	, dust = require('dustjs-linkedin')
	, cons = require('consolidate')
	, crypto = require('crypto')
	, fs = require('fs')
	, bodyParser = require('body-parser')
	, cookieParser = require('cookie-parser')
	, httpreq = require('http')
	, session = require('express-session')
	, mongoStore = require('connect-mongo')(session);
	
	var salt = "osaldhnfkjasbdfkjbi1`iu1n3kej32k1nk3ndkjfnkin312323sdnfgk";//crypto.randomBytes(128).toString('base64');
	
	var http = module.exports = express();
	http.server = httpreq.createServer(http);

	http.use(express.static(__dirname + '/public'));
	http.engine('dust', cons.dust);
	http.set('views', __dirname + '/views');
	http.set('view engine', 'dust');


	var sessionStore = new mongoStore({ db : "Sessions" }, function(e){
		http.use(bodyParser());
		http.use(cookieParser());
		http.use(session({
			store: sessionStore,
			secret: "killamanjaro"
		}));	
		sessionStore.clear();
	});
	
	
	/////////////////////////////////////////////////////Routes////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var router = express.Router();//Create out main router
	
	// Index route, starting route
	router.get('/', function(req,res){
		res.render ('test', {title: 'test'});

	});
	router.get('/main', function(req,res){
		res.render ('index', {title: 'index'});

	});
	
	router.get('/accounts', function(req,res){
		self.database.get_accounts(function(e,o){
			res.send(o);
		});

	});
	
	router.post('/join', function(req,res){
		if ( typeof req.session.account === 'undefined' ){ 
			
			crypto.pbkdf2( req.body.password, salt, 10000, 512, function(err, dk) { 
			

				var data = { email: req.body.username, pass: dk.toString('base64'), company: req.body.company };

				self.database.join(data,function(e,o){
					if ( e )console.log("failed");
					else {
						if ( !o ) console.log("account exists");
						else {console.log("account created"); res.json({status: "success"}); }
					}
				});
			});

		}
	});
	
	
	// Login request, AJAX POST, send {username:"", password:""}
	router.post('/login', function(req,res){
		if ( typeof req.session.account === 'undefined' ){
		
			crypto.pbkdf2( req.body.password, salt, 10000, 512, function(err, dk) {
			
				
				var data = { email: req.body.username, pass: dk.toString('base64'), company: req.body.company };
				
				self.database.login(data, function(e,o){
					if ( e )console.log("failed");
					else {
						if ( o == 1) console.log("account does not exist");
						else if ( o == 2) console.log("password does not match");
						else {
							req.session.account = {username: req.body.username};
							console.log("logged in"); 
							res.json({status: "success"});
						}
					}						
				});
			});
		}
	});
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	
			//sessionStore.destroy(req.cookies['connect.sid'], function(){ console.log("done"); });
			//req.session = null;
			

	http.use('/',router); //Initialize all routes
	http.server.listen(port); //Listen on HTTP server
	this.http = http; 
}


module.exports = global.Web = Web;


