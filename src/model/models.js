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

module.exports.UserModel = new mongoose.model('User', UserSchema)
