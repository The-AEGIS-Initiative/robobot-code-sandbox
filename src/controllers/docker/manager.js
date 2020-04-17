/** Initialize docker containers
 * @module docker/manager
 */

// spawn_process module
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { spawn, execSync } = require('child_process');

// Store key:value map of container_id:container_process
// TODO: Store data in database
const ContainerInfo = {}

// Track current container index for creating unique container names
// TODO: replace with more robust method
var containerIndex = 0;

/** Terminate (stop & remove) all containers
 * @function
 * @memberof module:docker/managers
 */
module.exports.resetContainers = () => {
    var {stdout, stderr } = execSync("docker rm -f $(docker ps -a -q) || :");
    console.log(stderr);
    console.log(stdout);
    return stdout;
}

/** Terminate (stop & remove) specified container
 * @function
 * @memberof module:docker/manager
 * @param {*} containerName name of target container
 */
module.exports.rmContainer = async (containerName) => {
    var { stdout, stderr } = await exec(`docker rm -f ${containerName} || :`);
    if (stderr) {console.log(stderr)};
    console.log(`${containerName} recycled!`);
}

module.exports.assignContainerAndPort = (clientID) => {
    // Create unique port
    var port = 8080+containerIndex;
    // Create unique container name
    containerName = `container_${clientID}`;
    // Increment container index tracker
    containerIndex = containerIndex + 1;

    ContainerInfo[containerName] = {process: null,
        clientID: clientID, 
        port: port,
        containerName: containerName};

    return ContainerInfo[containerName]
}

/** Initialize set of containers
 * @function
 * @memberof module:docker/manager
 * @param {*} num_containers number of containers to initialize
 */
module.exports.sandboxUserCode = (port, containerName, userCodeSource, userCodeTarget) => {
    console.log(`Initializing ${containerName}`);
    
    // Spawn container
    var docker_process = spawnDocker('kevinkqi/python-game-server:latest', port, containerName, userCodeSource, userCodeTarget);
    
    // Store child process information in ContainerInfo
    ContainerInfo[containerName].process = docker_process;
}


/** Spawn new docker container process
 * @function
 * @memberof module:docker/manager
 * @param {*} image docker image to run
 * @param {*} port must be an unused port
 * @param {*} containerName container name for referencing
 */
const spawnDocker = async (image, port, containerName, userCodeSource, userCodeTarget) => {
    var { stdout, stderr } = await exec(`docker rm -f ${containerName} || :`);
    if (stderr) {console.log(stderr)};
    console.log(`${containerName} recycled!`);

    try {
        var docker = spawn('docker', ['run', '-t', '-d', '--rm',
                                '-p', `${port}:8080`,
                                '--name', `${containerName}`,
                                `${image}`, 'sh']);
    } catch {(e) => console.log(e)};
    

    docker.stdout.on('data', async (data) => {
        console.log(`${containerName} stdout: ${data}`);
        var {stdout, stderr } = await exec(`docker cp ${userCodeSource} ${containerName}:${userCodeTarget}`);
        console.log(stderr);
        console.log(stdout);
        var {stdout, stderr } = await exec(`docker exec ${containerName} python /app/main.py`);
        console.log(stderr);
        console.log(stdout);

    });

    docker.stderr.on('data', (data) => {
        console.error(`${containerName} stderr: ${data}`);
    });

    return docker;
}

