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
  const username = req.body.username
  const level = req.body.level
  const code = req.body.code

  // Attempt to update level data
  UserModel.findOneAndUpdate(
      {'username': username, "progress.level": level},
      {'$set': {"progress.$.code": code}}, 
      function(err, doc) {
        console.log(`Existing code data for ${level}: ${doc}`)

        // Push if no data for level found
        if(doc == null){ 
          UserModel.findOneAndUpdate(
            {'username': username},
            {'$push': {progress: {"level": level, "code": code}}},
            function(err, doc){
              console.log(`${username} progress: ${doc}`)
              if(doc == null){
                UserModel.create(
                  {'username': username, progress: {"level": level, "code": code}},
                  function(err){
                    if (err) {
                      res.error = err;
                      res.sendStatus(500);
                      console.log(err)
                    } else {
                      console.log("user added and code added")
                      res.sendStatus(200);
                    }
                  }
                )
              } else {
                if (err) {
                  res.error = err;
                  res.sendStatus(500);
                  console.log(err)
                } else {
                  console.log("user code added")
                  res.sendStatus(200);
                }
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

router.get('/code/:username/:level', function(req, res) {
  const username = req.params.username
  const level = req.params.level


  UserModel.findOne(
      {'username': username, "progress.level": level},
      'progress.$',
      function(err, doc) {
        // No level data found
        if(doc == null){ 
          console.log("No user progress for this level")
          res.send({"code": ""})
        } else {
          if (err) {
            if(username == ''){
              console.log("Unauthenticated client shouldn't be calling this endpoint")
              res.send({"code": ""})
              console.log(err)
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
