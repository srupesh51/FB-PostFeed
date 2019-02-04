const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user_lists'
  },
  desc: {
    type: String,
    required: true
  },
  image_url: {
    type: String
  },
  like: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  },
  comment:[{
    text: {
      type: String
    },
    date: {
      type: Date
    }
 }]
});
module.exports = Post = mongoose.model('post_list',postSchema);
