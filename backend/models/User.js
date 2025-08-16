const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: v => /^\S+@\S+\.\S+$/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: { type: String, required: true, minlength: 6 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);