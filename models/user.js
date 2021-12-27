const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');


const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Adresse email invalide');
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

