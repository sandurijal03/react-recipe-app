const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const {
  Types: { ObjectId },
} = Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  joinDate: {
    type: Date,
    default: Date.now(),
  },
  favorites: {
    type: [ObjectId],
    ref: 'Recipe',
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    next();
  }
  bcrypt.genSalt(12, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

module.exports = model('User', userSchema);
