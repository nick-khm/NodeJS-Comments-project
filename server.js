"use strict";
let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let Message = require('./models/message');

let app = express();
app.set('view engine','ejs');

/* Middlewares */
app.use('/',express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secure797913',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(require('./middlewares/flash'));

/* Routers */
app.get('/',(request, response)=>{
	Message.all(function(results){
		response.render("pages/index", {all_comments:results});
	});
});

app.get('/comment/:id',(request,response)=>{
	Message.find(request.params.id, function(result){
		response.render('pages/comment', {comment:result})
	});
});

app.post('/',(request,response)=>{
	if(request.body.message === undefined || request.body.message === '') {
		request.flash('error','votre message est vide :(');
		response.redirect('/');
	} else {
		Message.create(request.body.message, function() {
			request.flash('success',"Merci pour votre message !");
			response.redirect('/');
		});
	}
});

app.listen(8080);