

var Database  = function(db,books){
	this.db = db;
	this.books = books;
	this.self = require("mongojs").connect(db, books);

};


Database.prototype.join = function(data, callback){
	var self = this.self;
	
	self.users.findOne({_id: data.email}, function(e,o){
		if ( e ) callback( true, e );
		else if ( o ) callback( false, false );
		else if ( !o ){
			self.users.insert({_id: data.email, pass: data.pass, company: data.company},function(e,oo){
				if (e||!oo)callback(true,e);
				else callback(false, oo);
			});
		}
	});
};

Database.prototype.login = function(data, callback){
	var self = this.self;
	
	self.users.findOne({_id: data.email}, function(e,o){
		if ( e ) callback( true, e );
		else if ( !o ) callback( false, 1 );
		else if ( o ) {
			if ( data.pass == o.pass ) callback( false, o );
			else callback ( false, 2 );
		}
	});
};


Database.prototype.get_accounts = function(callback){
	var self = this.self;
	
	self.users.find( {}, {_id: 1, company:1 }, function(e,o){
		callback( false, o);
	});
};

/*
Database.prototype.add = function(u,callback){

	this.self.users.insert({_id:u._id, pass:u.pass,o:{}},function(e,o){
		if (e||!o)callback(true,e);
		else callback(false, o[0]);
	});
};

Database.prototype.load = function(u,callback){
	this.self.users.findOne({_id:u._id, pass:u.pass},function(e,o){
		if (e||!o)callback(true,null);
		else callback(false,o);
	});
};

Database.prototype.save = function(u,callback){

	this.self.users.update({_id:u._id, pass:u.pass},{$set:{o:u.o}},function(e,o){
		if (e||!o)callback(true,e);
		else callback(false,o);
	});
};
*/

//////////////////////////////////////////////////////////////////////////////
module.exports = global.Database = Database;


