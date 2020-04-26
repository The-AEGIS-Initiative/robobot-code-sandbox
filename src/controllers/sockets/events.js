/** socket.io events 
 * @module sockets/events
*/

// FileSystem module
const filesystem = require("fs");

// spawn_process module
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { spawn } = require('child_process');

const DockerManager = require('../docker/manager.js');
const ClientManager = require('../clients/manager.js');

const http = require('http');

const formatGameServerURL = (port, ip)  => {
    console.log("Container IP:", ip);
    ip = ip.replace(/\./g,"-")
    const base = 'us-west-2.compute.amazonaws.com'
    const url = `ec2-${ip}.${base}:${port}/websocket`
    console.log(url)
    if(ip != ''){
        return url
    } else {
        return `localhost:${port}/websocket`
    }
    
}

var ip = '';

if(process.env.NODE_ENV != 'development'){
    http.get('http://169.254.169.254/latest/meta-data/public-ipv4', (res) => {
        res.setEncoding('utf8');
        res.on('data', (data) => {
            console.log(data);
            ip = data
        });
    })
}



module.exports = (io) => {
    // On client socket connection
    io.on( "connection", function( socket )
    {

        console.log( "A user connected" );
        
        // Get client ID
        const clientID = ClientManager.assignClientID();
        console.log(clientID);

        // Get next available container
        const containerInfo = DockerManager.assignContainerAndPort(clientID);
        const containerName = containerInfo.containerName;
        const port = containerInfo["port"];

        console.log(`${clientID} has been assigned ${containerName} and port ${port}`);
        

        // Send client ID and port to client
        socket.emit("init", {"clientID": clientID, 
                             "gameServerUrl": formatGameServerURL(port, ip)});
        console.log("Sent assigned clientID and port to client");




        // Begin listening for submitUserCode events from client
        socket.on('submitUserCode', (data) => {
            // Write user code to file with .java extension
            filesystem.writeFile("public/usercode/temp.py", data["data"], err => {
                // Throw errors
                if (err) throw err;

                // User code saved successfully
                console.log("User code written to disk");
            });

            // Send and run user code in designated container
            DockerManager.sandboxUserCode(containerInfo["port"], 
                                          containerInfo["containerName"],
                                          `public/usercode/temp.py`,
                                          `/app/game/user_code.py`);
        });





        // Listen for stopUserCode events to stop execution
        socket.on("stopUserCode", () => {
            // Remove used container that was assigned to this client
            DockerManager.rmContainer(containerInfo.containerName);
        });





        // Client disconnection event
        socket.on("disconnect", () => {
            // Remove used container that was assigned to this client
            DockerManager.rmContainer(containerInfo.containerName);
        })
    });

    
}

