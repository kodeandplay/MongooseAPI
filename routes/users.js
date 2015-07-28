var express = require('express'),
	UserModel = require('../models/user');

var router = express.Router({
		
	// '/foo' and '/foo/' are treated the same
	strict: false, 	

	// '/Foo' and '/foo' aret treated the same
	caseSensitive: false,	

	// Parent and child have conflicting param names
	mergeParams: false

});

router.post('/', function(req, res, next) {
	
	// Create new user with data form post body
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