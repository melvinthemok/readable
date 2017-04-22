const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [
      true,
      'an email address is required'
    ],
    unique: [
      true,
      'that email address belongs to an existing user'
    ],
    lowercase: [
      true,
      'please key in your email address in lowercase'
    ],
    match: [
      emailRegex,
      'that email address is not a valid regular expression'
    ]
  },
  name: {
    type: String,
    minlength: [
      3,
      'your user name must be between 3 and 40 characters'
    ],
    maxlength: [
      40,
      'your user name must be between 3 and 40 characters'
    ]
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: [
      true,
      'please state if you are a student or a teacher'
    ]
  },
  readingLevel: {
    type: Number,
    min: [
      1,
      'please specify your reading level between 1 and 50'
    ],
    max: [
      50,
      'please specify your reading level between 1 and 50'
    ],
    required: [
      function() {
        return this.role === 'student'
      },
      'please specify your reading level'
    ]
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [
      true,
      'please provide your gender'
    ]
  },
  age: {
    type: Number,
    min: [
      5,
      'please specify your age'
    ],
    max: [
      50,
      'please specify your age'
    ],
    required: [
      true,
      'please specify your age'
    ]
  },
  password: {
    type: String,
    required: [
      true,
      'a password is required'
    ],
    minlength: [
      8,
      'your password must be between 8 and 30 characters'
    ],
    maxlength: [
      30,
      'your password must be between 8 and 30 characters'
    ]
  },
  attending: {
    type: Boolean,
    required: true
  }
  // createdPrograms: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Program'
  //   }
  // ]
})

UserSchema.pre('save', function (next) {
  let user = this
  if (!user.isModified('password')) return next()
  let hash = bcrypt.hashSync(user.password, 10)
  user.password = hash
  next()
})

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

UserSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    delete ret.password
    return ret
  }
}

let User = mongoose.model('User', UserSchema)

module.exports = User
