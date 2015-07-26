var mongoose = require('mongoose');

var Schema = mongoose.Schema({
	title: String,
	text: String
});

var Post = mongoose.model('Post', Schema, 'posts');

module.exports = Post;