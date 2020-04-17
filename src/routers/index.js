var express = require('express');
var router = express.Router();

// Import authentication method
const withAuth = require('../../middleware.js');

/**
	Route serving index
*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Authentication api
router.get('/checkToken', withAuth, function(req, res) {
	res.sendStatus(200);
});


module.exports = router;
