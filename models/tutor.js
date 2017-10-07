var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var phoneRegex = /^\d{8}$/

var TutorSchema = new mongoose.Schema({
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
      'that email address is not a valid regular expression'
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
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [
      true,
      'please provide your gender'
    ]
  },
  age: {
    type: String,
    enum: [
      '16 to 25',
      '26 to 35',
      '36 to 45',
      '46 to 55',
      '56 to 65',
      'Above 66'
    ],
    required: [
      true,
      'please specify your age range'
    ]
  },
  experience: {
    type: String,
    maxlength: [
      500,
      'please specify your experience within 500 characters'
    ]
  },
  startDate: {
    type: Date,
    required: [
      true,
      'please specify when you joined ReadAble'
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
    enum: ['catchPlus', 'tutor'],
    required: true,
    default: 'tutor'
  },
  admin: {
    type: Boolean,
    required: true
  },
  attending: {
    type: Boolean,
    required: true
  }
})

TutorSchema.pre('save', function (next) {
  var tutor = this
  if (!tutor.isModified('password')) return next()
  var hash = bcrypt.hashSync(tutor.password, 10)
  tutor.password = hash
  next()
})

TutorSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('the email, name, and/or phone number you provided is/are already in use'))
  } else {
    next(error)
  }
})

TutorSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

TutorSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    delete ret.password
    return ret
  }
}

var Tutor = mongoose.model('Tutor', TutorSchema)

module.exports = Tutor
