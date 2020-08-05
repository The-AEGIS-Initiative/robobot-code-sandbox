/* Schema for test data
  */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const ProgressSchema = new Schema({
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
	username: 
	{
		type: String,
		required: true,
		unique: true
	},
	progress:
	{
		type: [ ProgressSchema ]
	}
});

const LevelSchema = new Schema({
	level: 
	{
		type: String,
		required: true,
		unique: true
	},
	levelData:
	{
		type: String,
		required: true
	},
	code: 
	{
		type: String,
		required: true
	},
	prompt: 
	{
		type: String,
		required: true,
	},
	task: 
	{
		type: String,
		required: true
	},
	lesson: 
	{
		type: String,
		required: true
	}
})

module.exports.UserModel = new mongoose.model('User', UserSchema)
module.exports.LevelModel = new mongoose.model('Level', LevelSchema)