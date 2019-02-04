const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateFetchCommentInput(data) {
  let errors = {};

  data.post_id = !isEmpty(data.post_id) ? data.post_id : '';

  if (Validator.isEmpty(data.post_id)) {
    errors.post_id = 'Post Id field is required';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
