const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateVerificationEmail(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.verification_link = !isEmpty(data.verification_link) ? data.verification_link : '';
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }
  if (Validator.isEmpty(data.verification_link)) {
    errors.verification_link = 'Verification Link field is required';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
