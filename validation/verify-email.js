const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateVerification(data) {
  let errors = {};
  
  data.email = !isEmpty(data.email) ? data.email : '';
  data.otp = !isEmpty(data.otp) ? data.otp : '';
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }
  if (Validator.isEmpty(data.email)) {
    errors.otp = 'OTP field is required';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
