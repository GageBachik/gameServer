var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

var pg = require('pg');
var conString = "postgres://localhost:5432/gameServer";

app.post('/signUp', function(req, res) {
	var client = new pg.Client(conString);
	client.connect();
	var query = client.query("INSERT INTO users (username, email, password) VALUES ('" + req.body.username + "','" + req.body.email + "','" + req.body.password + "')", function (err, result){
		if(err) {
				return console.error('Query error', err);
		}
		res.send("added user!")
	});
	query.on('end', function() {
		client.end();
	});
});

app.post('/signIn', function(req,res){
	var client = new pg.Client(conString);
	client.connect();
	var query = client.query("SELECT * FROM users WHERE username='" + req.body.username + "'", function (err, result){
		if(err) {
				return console.error('Query error', err);
		}
		console.log(result.rows);
		if (result.rows[0].password === req.body.password) {
			res.send(result.rows[0]);
		}else{
			res.send("Incorrect password bro.");
		}
	});
	query.on('end', function() {
		client.end();
	});
})

app.get('/test', function(req,res){
	var client = new pg.Client(conString);
	client.connect();
	var query = client.query('SELECT * FROM users', function (err, result){
		if(err) {
				return console.error('Query error', err);
		}
		console.log(result.rows);
		res.send(result.rows);
	});
	query.on('end', function() {
		client.end();
	});
})

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

// 'CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(20) not null, email VARCHAR(40) not null, password VARCHAR(40) not null)'