const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  googleId: String,
  thumbnail: String
});

//will be pluralized to Users on mongodb
const User = mongoose.model('user', userSchema);

module.exports = User;
