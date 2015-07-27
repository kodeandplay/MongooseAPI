var express = require('express'),
	UserModel = require('../models/user');

var router = express.Router({
		caseSensitive: 	false,	// '/Foo' and '/foo' aret treated the same
		mergeParams: 	false,	// Parent and child have conflicting param names
		strict: 		false 	// '/foo' and '/foo/' are treated the same
	});

router.post('/', function(req, res, next) {
	var user = new UserModel(req.body);
	user.save(function(err, result) {
		if(err) {
			console.log('Error:', err);
			return next(err);
		}

		res.send(result.toJSON());
	});
});












module.exports = router;