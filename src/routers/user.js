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
 * @namespace userRouter
 */
const router = express.Router();

/**
 * express module
 * @const
 */
const { UserModel }= require("../model/models.js");

const jwt = require('jsonwebtoken');

router.post('/code', function(req, res) {
  const token = req.cookies.token;
  var payload = jwt.decode(token)

  const email = payload.email
  const level = req.body.level
  const code = req.body.code
  console.log(payload)

  // Attempt to update level data
  UserModel.findOneAndUpdate(
      {'email': email, "progress.level": level},
      {'$set': {"progress.$.code": code}}, 
      function(err, doc) {
        console.log(doc)

        // Push if no data for level found
        if(doc == null){ 
          UserModel.findOneAndUpdate(
            {'email': email},
            {'$push': {progress: {"level": level, "code": code}}},
            function(err, doc){
              console.log(doc)
                if (err) {
                res.error = err;
                res.sendStatus(500);
                console.log(err)
              } else {
                console.log("user code updated")
                res.sendStatus(200);
              }
            }
          );
        } else {
          if (err) {
            res.error = err;
            res.sendStatus(500);
            console.log(err)
          } else {
            console.log("user code updated")
            res.sendStatus(200);
          }
        }
        
      }
  );
});

router.get('/code/:level', function(req, res) {
  const token = req.cookies.token;
  if(token == null){
    console.log("No authorization");
    res.send({"code": ""})
  }
  var payload = jwt.decode(token)

  const email = payload.email
  const level = req.params.level

  console.log(token)
  

  // Attempt to update level data
  UserModel.findOne(
      {'email': email, "progress.level": level},
      'progress.$',
      function(err, doc) {
        
        // No level data found
        if(doc == null){ 
          console.log("No user progress for this level")
          res.send({"code": ""})
        } else {
          if (err) {
            if(token == null){
              res.send({"code": ""})
            }
            res.error = err;
            res.send({"code": ""})
            console.log(err)
          } else {
            console.log(doc.progress[0].level)
            console.log("Sent user level data")
            res.send({"code": doc.progress[0].code})
          }
        }
        
      }
  );
});


module.exports = router;
