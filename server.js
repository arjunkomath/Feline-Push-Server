var express = require('express');
var request = require('request');
var promise = require('promise');
var GCM = require('gcm').GCM;
var app = express();

var keys = require('./keys.js');
var gcm = new GCM(keys.gcm);

app.get('/ping', function (req, res) {
	res.send('pong!');
});

app.get('/push', function (req, res) {
	var options = {
		url: 'http://d47f6ad0-e094-11e5-ab2c-c504a486d394.app.jexia.com',
		body: JSON.stringify(keys)
	};
	request.post(options, function(err, response, body) {
		var token = JSON.parse(body).token;
		var options = {
			url: 'http://d47f6ad0-e094-11e5-ab2c-c504a486d394.app.jexia.com/gcm_subscribers',
			headers: {
				'Authorization': 'Bearer ' + token
			}
		};
		request.get(options, function(err, response, body) {
			var data = JSON.parse(body);
			var sendPromise = data.map( function(d) {
				return new promise( function (resolve) {
					var message = {
						registration_id: d.token,
						'data.title': 'Title',
						'data.message': 'message'
					};
					gcm.send(message, function(err, messageId){
						if (err) {
							console.log("Something has gone wrong!");
						} else {
							console.log("Sent with message ID: ", messageId);
						}
						resolve(1);
					});
				})
			});
			promise.all(sendPromise).then(function() {
				res.json({status: 'done'});
			});
		});
	});
});

app.listen(3000, function () {
	console.log('Feline server running on port 3000!');
});