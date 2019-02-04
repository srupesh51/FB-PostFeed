const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostCreationInput(data) {
  let errors = {};

  data.desc = !isEmpty(data.desc) ? data.desc : '';
  data.image = !isEmpty(data.image) ? data.image : '';
  data.img_data = !isEmpty(data.img_data) ? data.img_data : '';
  data._id = !isEmpty(data._id) ? data._id : '';
  if (Validator.isEmpty(data.desc)) {
    errors.desc = 'Description field is required';
  }

  if (Validator.isEmpty(data.image)) {
    errors.image = 'Image field is required';
  }

  if (Validator.isEmpty(data._id)) {
    errors.id = 'Id field is required';
  }
  if (Validator.isEmpty(data.img_data)) {
    errors.img_data = 'Image Data is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
