var express = require('express');
var router = express.Router();
const DockerManager = require('../controllers/docker/manager.js');


/**
	Route serving index
*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/updateGameServer', function(req, res) {
	const successCallBack = (log) => {res.status(200).send(log)}
	const failCallBack = (err) => {res.status(500).send(err)}
	DockerManager.updateGameServer(successCallBack, failCallBack)
})


module.exports = router;
