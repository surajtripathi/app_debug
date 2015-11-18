var express = require('express');
var util = require('util');
var fs = require('fs');
var path = require('path');
var url = require('url');
var http = require('http');


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
	var externalUrl = url.parse(decodeURIComponent(req.query.reqUrl));
	var data = req.query.reqData;
	var options = {
	  host: externalUrl.hostname,
	  port: externalUrl.port,
	  path: externalUrl.path,
	  method: req.query.reqMethod
	};
	console.log("path name : " + externalUrl.path);
	if(options['host']){
		getDataFromUrl(options, data, res);
	} else {
		// var url = decodeURIComponent(req.query.reqUrl);
		// var method = req.query.reqMethod;
		// var data = req.query.reqData;
		// console.log(method+" m " + data + " d " + url);

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
		});
	}
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

function getDataFromUrl(options, reqData, parentRes){
	// var options = {
	//   host: 'www.google.com',
	//   port: 80,
	//   path: '/upload',
	//   method: 'POST'
	// };

	var req = http.request(options, function(res) {
	  //console.log('STATUS: ' + res.statusCode);
	  console.log(JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  parentRes.writeHead(res.statusCode , res.headers);
	  res.on('data', function (chunk) {
	  	//console.log("data 1234" + chunk);
	    parentRes.write(chunk);
	  });
	  res.on('end',function(){
	  	parentRes.end();
	  });
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	// write data to request body
	req.write(reqData);
	req.end();
}

// function successHandlerForGetDataFromUrl(data, response) {
// }

var server = app.listen(process.env.PORT || 8888, function(){
	console.log("running...");
});