const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../../models/Post');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateCommentCreationInput = require('../../validation/create-comment');
const validateFetchCommentInput = require('../../validation/fetch-comment');

router.post('/create-comment', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateCommentCreationInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Post.findOne({_id: req.body.post_id}).then(post => {
    const newComment = {
      text: req.body.text,
      date: new Date()
    }
    post.comment.push(newComment);
    post.save().then(post_data => res.json(post_data))
    .catch(err => res.json(err));
  }).catch(err => res.json(err));
});

module.exports = router;
