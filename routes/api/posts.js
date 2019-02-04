const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../../models/Post');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const AWS = require('aws-sdk');
const validatePostCreationInput = require('../../validation/create-post');
const validateLikeCreationInput = require('../../validation/create-like');
const awsConfig = require('../../config/aws-config');
const s3 = new AWS.S3({
  accessKeyId: awsConfig.AWS_ACCESS_ID,
  secretAccessKey: awsConfig.AWS_SECRET_KEY
});
router.post('/create-post', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostCreationInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const buffer = new Buffer(req.body.img_data.replace(/^data:image\/\w+;base64,/, ""),'base64')
  const params = {
       Bucket: awsConfig.AWS_BUCKET, // pass your bucket name
       Key: (req.body.image), // file will be saved as testBucket/contacts.csv
       Body: buffer,
       ContentEncoding: 'base64',
       ContentType: 'image/jpeg'
   };
   s3.upload(params, function(s3Err, data) {
      console.log(s3Err);
      if (s3Err)  return res.status(400).json({'Error':'File Upload'});
      const newPost = new Post({
          desc: req.body.desc,
          like: 0,
          image_url: data.Location,
          user: req.body._id,
          comment: []
        });
        newPost.save()
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json(err));
    });
});
router.post('/create-like', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateLikeCreationInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
 Post.findOne({_id: req.body.post_id}).then(post => {
     post.like = parseInt(req.body.like);
     post.save().then(post_data => res.json(post_data))
     .catch(err => res.json(err));
  }).catch(err => res.json(err));
});
router.get('/', passport.authenticate('jwt', { session: false }),(req,res) => {
    Post.find({}).populate('user', ['image_url']).sort({date: 'descending'}).then(posts => {
        res.status(200).json(posts);
    }).catch(err => console.log(err));
});

module.exports = router;
