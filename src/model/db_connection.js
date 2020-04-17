/* Handles MongoDB connection via Mongoose. 
 * Export layer for data models.
 */
var mongoose = require("mongoose");
var config = require("../../config.json");

// Set Mongoose to use native JS promises
mongoose.Promise = Promise;
mongoose.set('useFindAndModify', false);

// Connect to mlab MongoDB
DB_USERNAME = process.env.DB_USERNAME
DB_PASSWORD = process.env.DB_PASSWORD
DB_URL = process.env.DB_URL
console.log(DB_USERNAME)

const server = "mongodb+srv://"+DB_USERNAME+":"+DB_PASSWORD+DB_URL;
console.log(server)
mongoose.connect(server, { useNewUrlParser: true, dbName: "testdb" });

// Check if connection is successful
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", function(callback){
	console.log("MongoDB connection succeeded.");
});