var mongoose = require('mongoose');
var enumRoles = ['guest', 'admin', 'staff'];

var Schema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},

	role: {
		type: String,
		enum: enumRoles
	} 
});





var User = mongoose.model('User', Schema, 'users');
module.exports = User;