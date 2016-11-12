"use strict";
let connection = require('../config/db');
let moment = require('../config/moment');

class Message {
	constructor(raw_message){
		this.message = raw_message;
	}
	get id() {
		return this.message.id;
	}
	get created_at(){
		return moment(this.message.created_at).fromNow();
	}
	get content() {
		return this.message.content;
	}
	static create(content, cb) {
		connection.query('INSERT INTO commentsexample SET content=?, created_at=?', [content, new Date()], function(err, results){
			if(err) throw err;
			cb();
		});
	}

	static all(cb) {
		connection.query('SELECT * FROM commentsexample ORDER BY id DESC', [], function(err, results) {
			if(err) throw err;
			cb(results.map(function(row){return new Message(row);}));
		});
	}

	static find(id, cb) {
		connection.query('SELECT * FROM commentsexample WHERE id=?', [id], function(err, results) {
			if(err) throw err;
			cb(new Message(results[0]));
		});
	}
}

module.exports = Message;