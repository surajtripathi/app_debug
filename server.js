express = require('express');
util = require('util');
fs = require('fs');
path = require('path');

app = express();
app.get('/*\.*', function(req, res) {
	var filePath = __dirname + req.url;
	var extension = path.extname(req.url);
	console.log(extension);
	console.log(filePath);
	var extensionMap = {
		'.html' : 'text/html',
		'.js' : 'application/javascript',
		'.css' : 'text/css',
		'.jpg' : 'image/jpeg',
		'.png' : 'image/png',
		'.ico' : 'image/ico',
		'.htm' : 'text/htm',
		'.text' : 'text/plain'
	}
	if((extension in extensionMap)){
		console.log("correct extension");
		fs.exists(filePath, function(exists) {
			if(exists) {
				getFile(filePath, res, extensionMap[extension]);
			} else {
				res.writeHead(500);
				res.end();
			}
		});
	} else {
		res.writeHead(404);
		res.end();
		console.log("incorrect extension");
	}
});

app.get('/', function(req, res){
	var filePath = __dirname + '/' + 'index.html';
	var mimeType = 'text/html';
	fs.exists(filePath, function(exists){
		if(exists) {
			console.log("hello")
			getFile(filePath, res, mimeType);
		} else {
			res.writeHead(500);
			res.end();
		}
	}) 
});
app.get('/debug', function(req, res){
	var filePath = __dirname + '/' + 'debug/debug.html';
	var mimeType = 'text/html';
	fs.exists(filePath, function(exists){
		if(exists) {
			console.log("hello")
			getFile(filePath, res, mimeType);
		} else {
			res.writeHead(500);
			res.end();
		}
	}) 
});

app.post('/hello', function(req, res) {
	res.writeHead(200, { 'Content-Type' : 'text/plain'});
	res.write("hi...\n")
	res.end("this is a post request");
});

app.put('/hello', function(req, res) {
	res.writeHead(200, { 'Content-type' : 'text/plain'});
	res.write("hi...\n")
	res.end("this is a put request");
});

app.delete('/hello', function(req, res) {
	res.writeHead(200, { 'Content-type' : 'text/plain'});
	res.write("hi...\n")
	res.end("this is a delete request");
});

function getFile(path, response, mimeType) {
	fs.readFile(path, function(error, content) {
		if(!error) {
			response.writeHead(200, { 'Content-Type' : mimeType, 'Content-Length' : content.length });
			response.end(content);
		} else {
			response.writeHead(404);
			response.end();
		}
	});
}

var server = app.listen(process.env.PORT || 8888, function(){
	console.log("running...");
});