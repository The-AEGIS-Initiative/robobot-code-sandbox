/* Handles MongoDB connection via Mongoose. 
 * Export layer for data models.
 */
var mongoose = require("mongoose");

// Set Mongoose to use native JS promises
mongoose.Promise = Promise;
mongoose.set('useFindAndModify', false);


var server = ""
if(process.env.NODE_ENV=='development') { // Dev environment
	server = 'mongodb://127.0.0.1:27017'
} else { // Production environment
	const DB_USERNAME = process.env.DB_USERNAME
	const DB_PASSWORD = process.env.DB_PASSWORD
	const DB_URL = process.env.DB_URL
	server = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}${DB_URL}/robobot-database?ssl=true&replicaSet=Robobot-shard-0`;
}


// Connect to MongoDB
console.log(server)
mongoose.connect(server, { useNewUrlParser: true, useCreateIndex: true })
				.then(() => console.log('Atlas MongoDB connection succeeded'))
				.catch(err => console.log(err));