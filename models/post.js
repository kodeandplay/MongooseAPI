var mongoose = require('mongoose');
var enumRoles = ['guest', 'admin', 'staff'];


var Schema = mongoose.Schema({
	title: { 
		type: String, 
		required: true, 
		trim: true,
		match: /^([\w ,.!?]{1,100})$/
	},

	text: {	
		type: String, 
		required: true,
		max: 2000 
	},

	followers: [mongoose.Schema.Types.ObjectId],

	comments: [{
		text: { 
			type: String, 
			trim: true, 
			max: 2000 
		},

		author: { 
			id: { 
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User' 
			},
			name: String, // Store here for convenience instead of having to query User collection
			role: {
				type: String,
				enum: enumRoles
			}
		}
	}],

	meta: mongoose.Schema.Types.Mixed, 

	viewCounter: {
		type: Number, 
		default: 0 
	},

	published: {
		type: Boolean,
		default: false
	},

	createdAt: {
		type: Date,
		default: Date.now
	},

	updatedAt: {
		type: Date,
		default: Date.now
	}
});

var Post = mongoose.model('Post', Schema, 'posts');

module.exports = Post;