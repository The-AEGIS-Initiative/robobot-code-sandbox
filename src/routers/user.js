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

const axios = require('axios');

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

router.post('/register', function(req, res, next) {
  const body = req.body;

  const email = body.email;
  const password = body.password;

  // Logging
  // DANGER
  console.log("request body: ", body);
  console.log("email: ", email);
  console.log("password: ", password);

  // Create document from UserModel
  const user = new UserModel({
    email: email,
    password: password
  })

  // Save user document into database
  user.save().then(() => {
    console.log("Data successfully posted to database")
    res.status(200).json({
        message: "Request body POST-ed"
    });
  }).catch((e) => {
    res.status(500)
      .send("Error with user registration. Please try again.");
    console.log(e);
    console.log("Data save failed");
  });
});

router.post('/authenticate', function(req, res) {
  const data = {
    grant_type: req.body.grantType,
    client_id: process.env.cognito_clientId,
    code: req.body.accessToken,
    scope: 'profile',
    redirect_uri: process.env.cognito_redirectCallback,
  };

  const p = {
    method: 'post',
    url: `${process.env.cognito_domainUrl}/oauth2/token`,
    data: qs.stringify(data),

    auth: {
      username: process.env.cognito_clientId,
      password: process.env.cognito_secret,
    },
  };

  console.log(`AWS oauth2 token request params: ${JSON.stringify(p)}`);
  const awsResponse = await axios(p);
  console.log(`AWS oauth response: ${JSON.stringify(awsResponse.data)}`);

  res.send(awsResponse);
});

router.get('/logout', function(req, res) {
  const token = jwt.sign({"empty": ""}, process.env.SECRET_TOKEN, {
    expiresIn: '1s'
  });

  console.log("clearing cookie")
  res.clearCookie('token')
  res.sendStatus(200)
});

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
