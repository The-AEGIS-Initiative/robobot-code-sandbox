/* Schema for test data
  */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const LevelSchema = new Schema({
	level: 
	{
		type: String,
		required: true,
		unique: true
	},
	code:
	{
		type: String
	}
})

const UserSchema = new Schema({
	email: 
	{
		type: String,
		required: true,
		unique: true
	},
	password:
	{
		type: String,
		required: true
	},
	progress:
	{
		type: [ LevelSchema ]
	}
});



// Hash passwords before saving
// pre function is applied when a document is saved
UserSchema.pre('save', function(next) { 
	// function(){} instead of () => {} because arrow functions
	// do not maintain references to this

	//reference to this (the document)
	const document = this;

	// Check if document is new or password is new
	if (this.isNew || this.isModified('password')) {
		bcrypt.hash(document.password, saltRounds, 
			function(err, hashedPassword) {
				if (err) {
					next(err)
				} else {
					document.password = hashedPassword;
					next();
				}
			});
	} else {
		next();
	}
});

UserSchema.methods.isCorrectPassword = function(password, callback){
	bcrypt.compare(password, this.password, function(err, same) {
		if (err) {
			callback(err);
		} else {
			callback(err, same)
		}
	})
}

module.exports.UserModel = new mongoose.model('User', UserSchema)
