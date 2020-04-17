const DockerManager = require('../docker/manager.js');

// Stores client info
// TODO: Store info in database
const ClientInfo = {}

// clientID counter
// TODO: Replace with more robust method
var clientID = 0;

// Generate unique client ID
module.exports.assignClientID = () => {
    clientID = clientID + 1;
    return clientID;
}

