/** Express router demonstrating various API endpoints
 * @module routers
 * @requires express
 * @requires src/model/database
 */

/**
 * express module
 * @const
 */
const express = require('express');

/**
 * Express router to mount example functions
 * @type {object}
 * @const
 * @namespace exampleRouter
 */
const router = express.Router();

/**
 * express module
 * @const
 */
const Database = require("../model/database");


/** 
 * GET endpoint for TestModel data
  * @name get
  * @function
  * @memberof module:routers~exampleRouter
  * @inner
  * @param {string} /example/database/get - API endpoint
  * @param {callback} callback - retrieve TestModel data
  * @example localhost:8000/example/database/get
  * @example ...
  */
router.get('/database/get', function(req, res, next) {
  result = []
  Database.TestModel.find().then((result) => {
      console.log(JSON.stringify(result));
      res.send(JSON.stringify(result));
  }).catch((e) => {
      console.log(e);
      console.log("Fetch data from TestModel FAILED!");
  })
});

/** 
 * Handles POST requests to TestModel
 * @name post
 * @function
 * @memberof module:routers~exampleRouter
 * @inner
 * @param {string} /example/database/form - API endpoint
 * @param {callback} callback - post data to TestModel
 * @example localhost:8000/example/database/form
 * @example ...
 */
router.post('/database/form', function(req, res, next) {
  const body = req.body;

  // Logging
  console.log("request body: ", req.body);

  // Create data model instance with request body
  var TestData = new Database.TestModel({
    name: req.body.name
  });

  // Save data instance into database
  TestData.save().then(() => {
    console.log("Data successfully posted to database")
    res.status(200).json({
        message: "Request body POST-ed",
        request_body: req.body
    });
  }).catch((e) => {
    console.log(e);
    console.log("Data save failed");
  });
});

/** 
 * Route serving input form for making POST requests to TestModel data
 * @name get
 * @function
 * @memberof module:routers~exampleRouter
 * @inner
 * @param {string} /example/database/form - API endpoint
 * @param {callback} callback - render input form
 * @example localhost:8000/example/database/form
 * @example ...
 */
router.get('/database/form', function(req, res, next) {
  res.render('form', { title: 'Example Form for making POST requests' });
});





module.exports = router;

