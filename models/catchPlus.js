var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var phoneRegex = /^\d{8}$/

var CatchPlusSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [
      true,
      'an email address is required'
    ],
    unique: true,
    lowercase: true,
    match: [
      emailRegex,
      'that email address is not valid'
    ]
  },
  name: {
    type: String,
    unique: true,
    minlength: [
      3,
      'your user name must be between 3 and 40 characters long'
    ],
    maxlength: [
      40,
      'your user name must be between 3 and 40 characters long'
    ]
  },
  phone: {
    type: String,
    unique: true,
    match: [
      phoneRegex,
      'that phone number is not valid'
    ],
    required: [
      true,
      'a valid phone number is required'
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
  userType: {
    type: String,
    enum: ['catchplus', 'tutor'],
    required: true,
    default: 'catchPlus'
  }
})

CatchPlusSchema.pre('save', function (next) {
  var catchPlus = this
  if (!catchPlus.isModified('password')) return next()
  var hash = bcrypt.hashSync(catchPlus.password, 10)
  catchPlus.password = hash
  next()
})

CatchPlusSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('the email, name, and/or phone number you provided is/are already in use'))
  } else {
    next(error)
  }
})

CatchPlusSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

CatchPlusSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    delete ret.password
    return ret
  }
}

var CatchPlus = mongoose.model('CatchPlus', CatchPlusSchema)

module.exports = CatchPlus
