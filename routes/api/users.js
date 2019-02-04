const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateVerificationEmail = require('../../validation/verification');
const validateVerification = require('../../validation/verify-email');
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');
const fs = require('fs');
const keys = require('../../config/keys');
const awsConfig = require('../../config/aws-config');
const passport = require('passport');
const s3 = new AWS.S3({
  accessKeyId: awsConfig.AWS_ACCESS_ID,
  secretAccessKey: awsConfig.AWS_SECRET_KEY
});
const path = require('path');
const twilioConfig = require('../../config/twilio-config');
const twilio = require('twilio')(
  twilioConfig.TWILIO_ACCESS_ID,
  twilioConfig.TWILIO_SECRET_KEY
);
const sendGridConfig = require('../../config/sendgrid-config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendGridConfig.SEND_GRID_API_KEY);
router.post('/create-user', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user && !user.verified) {
      errors.email = 'Your email is not verified. please check your email!';
      return res.status(400).json(errors);
    }
    if (user && user.verified) {
      errors.email = 'Email already exists. You need to login!';
      return res.status(400).json(errors);
    }
    const buffer = new Buffer(req.body.img_data.replace(/^data:image\/\w+;base64,/, ""),'base64')
    const params = {
         Bucket: awsConfig.AWS_BUCKET, // pass your bucket name
         Key: (req.body.user_photo), // file will be saved as testBucket/contacts.csv
         Body: buffer,
         ContentEncoding: 'base64'
     };
     s3.upload(params, function(s3Err, data) {
       if (s3Err)  return res.status(400).json({'Error':'File Upload'});
       console.log(`File uploaded successfully at ${data.Location}`)
       const newUser = new User({
           name: req.body.name,
           email: req.body.email,
           mobile: req.body.mobile,
           password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)),
           image_url: data.Location,
           dob: req.body.dob,
           address: req.body.address,
           verified: false
         });
         newUser.save()
         .then(user => res.status(200).json(user))
         .catch(err => res.status(400).json(err));
     });
   }).catch(err => res.status(400).json(err));
});
router.post('/login-user', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: req.body.email }).then(user => {
      // Check for user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = { id: user._id, name: user.name, image_url: user.image_url }; // Create JWT Payload

          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token,
                id: user._id
              });
            }
          );
        } else {
          errors.password = 'Password incorrect';
          return res.status(400).json(errors);
        }
      }).catch(err => res.status(400).json(err))
   });
});
router.post('/verification-email',(req, res) => {
  const { errors, isValid } = validateVerificationEmail(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    const otpGenerator = require('otp-generator')
    const OTP = otpGenerator.generate(6);
    const msg = {
      to: req.body.email,
      from: sendGridConfig.SEND_GRID_FROM_USER,
      subject: 'Verification Code',
      text: "Your Verification Code:"+OTP+" .Please Click on the link to Verify your account. "+req.body.verification_link,
      html: "<strong>Your Verification Code:"+OTP+" .Please Click on the link to Verify your account. "+req.body.verification_link+" .Please note this will expire eventualy after sometime</strong>"
    };
    sgMail.send(msg).then((success) => {
      user.reset_code = OTP;
      user.save().then(user_data => res.status(200).json({'success':"Sent"}))
      .catch(err => res.json(err));
    }).catch((error) => {
      res.status(400).json({'error':"Failed"});
    });
 }).catch((error) => {
   res.status(400).json({'error':"Failed"});
 });
});
router.post('/confirm-verification', (req, res) => {
  const { errors, isValid } = validateVerification(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user && user.verified) {
      errors.email = 'Email is aready verified. You need to login!';
      return res.status(400).json(errors);
    }
    if(user.reset_code !== req.body.otp){
      return res.status(400).json({'Error': 'OTP Didnot match'});
    }
    user.verified = true;
    user.save().then(user_data => res.status(200).json({'success':"Sent"}))
    .catch(err => res.json(err));
  }).catch((error) => {
    res.status(400).json({'error':"Failed"});
  });
});
router.get('/', passport.authenticate('jwt', { session: false }),(req,res) => {
    User.find({}).then(user => {
        res.status(200).json(user);
    }).catch(err => console.log(err));
});
module.exports = router;
