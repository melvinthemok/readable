var mongoose = require('mongoose')

var PreSchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: [
      3,
      'the student\'s name must be between 3 and 40 characters long'
    ],
    maxlength: [
      40,
      'the student\'s name must be between 3 and 40 characters long'
    ]
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [
      true,
      'please provide this student\'s gender'
    ]
  },
  age: {
    type: Number,
    min: [
      5,
      'the student\'s age must be between ages 4 and 21 to qualify'
    ],
    max: [
      20,
      'the student\'s age must be between ages 4 and 21 to qualify'
    ],
    required: [
      true,
      'please specify this student\'s age'
    ]
  },
  family: {
    type: String,
    enum: [
      'Unknown',
      'A4', 
      'B6',
      'C3',
      'D4',
      'E4',
      'F2',
      'G2',
      'G3',
      'H4',
      'I2',
      'J2',
      'J3',
      'K3',
      'K4',
      'L2',
      'M2',
      'N2',
      'O4',
      'P4',
      'S4',
      'X2',
      'Z4'
    ]
  },
  startDate: {
    type: Date,
    required: [
      true,
      'please specify when this student joined ReadAble'
    ]
  },
  oneOnOne: {
    type: Boolean,
    required: true
  },
  intervention: {
    type: Boolean,
    required: true
  },
  generalComment: {
    type: String,
    maxlength: [
      500,
      'please keep this general comment within 500 characters'
    ]
  },
  preferredTutors: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor'
      }
    ]
  },
  kidsToAvoid: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PreSchool'
    }
  ],
  attendance: [
    {
      tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor'
      },
      date: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Saturdate'
      }
    }
  ],
  attending: {
    type: Boolean,
    default: false,
    required: true
  }
})

PreSchoolSchema.path('preferredTutors').validate(function (preferredTutors) {
  return preferredTutors.length <= 3 || Object.prototype.toString.call(preferredTutors) !== '[object Array]'
}, 'each student should have a maximum of 3 preferred tutors')

PreSchoolSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('the name you provided is already in use'))
  } else {
    next(error)
  }
})

var PreSchool = mongoose.model('PreSchool', PreSchoolSchema)

module.exports = PreSchool
