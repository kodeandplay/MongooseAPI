var mongoose = require('mongoose');
var enumRoles = ['guest', 'admin', 'staff'];


var Schema = mongoose.Schema({
	title: { 
		type: String, 
		required: true, 
		trim: true,
		match: /^([\w ,.!?]{1,100})$/,
		set: function(value) {
			return value.toUpperCase();
		},
		get: function(value) {
			return value.toLowerCase();
		}
	},

	photo: Buffer, // NodeJS data type

	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
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
		default: 0,
		validate: function(value) {
			return value < 0 ? false : true; // could have made even shorter but this is readable
		}
	},

	// published: Boolean
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

// Instead of creating 'set', 'get', 'validate' methods within
// the schema we can create each of them outside like below.
// This would require removing the validate property from viewCounter of course.
// Must preceed the initiation of the Model
//Schema.path('viewCounter').validate( function(value) {
//	return value >= 0;
//});

Schema.statics.staticMethod = function(callback) {
	console.log('static method called');
	return callback();
}

Schema.methods.someMethod = function(callback) {
	console.log('some method called on this model/document');
	return callback();
}


// Virtual Field
Schema.virtual('hasComments').get(function() {
	// this refers to Model
	return this.comments.length > 0
});

// Pre (save) Hook
Schema.pre('save', function(next) {

	this.updatedAt = new Date();
	next();
});

// Pre (validate) Hook
Schema.pre('validate', function(next) {
	var error = null,
		comments = this.comments,
		length = comments.length;

	if(this.isModified('comments') && length > 0) {

		for(var i = 0; i < length; i++) {
			if(!comments[i].text || !comments[i].author.id) {
				error = new Error('Text and author must be present.');
				return next(error)
			}
		}
	}

	// The text and author.id properties of the comment objects are 
	// all present, proceed.
	next();
});

// Post (save) hook
// Note: Mongo document associated with model is returned with post hooks
Schema.post('save', function(doc) {
	console.log('Object was saved.');
});

// Create Model
var Post = mongoose.model('Post', Schema, 'posts');

module.exports = Post;






















