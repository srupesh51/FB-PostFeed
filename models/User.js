const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean
  },
  reset_code: {
    type: String
  },
  mobile: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image_url: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = User = mongoose.model('user_lists',userSchema);
