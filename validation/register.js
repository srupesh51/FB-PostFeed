const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.mobile = !isEmpty(data.mobile) ? data.mobile : '';
  data.address = !isEmpty(data.address) ? data.address : '';
  data.dob = !isEmpty(data.dob) ? data.dob : '';
  data.img_data = !isEmpty(data.img_data) ? data.img_data : '';
  data.user_photo = !isEmpty(data.user_photo) ? data.user_photo : '';
  
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.mobile)) {
    errors.mobile = 'Phone Number is required';
  }

  if (Validator.isEmpty(data.user_photo)) {
    errors.user_photo = 'User profile picture is required';
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = 'Address is required';
  }

  if (Validator.isEmpty(data.dob)) {
    errors.dob = 'Date of birth is required';
  }

  if (Validator.isEmpty(data.img_data)) {
    errors.img_data = 'Image Data is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
