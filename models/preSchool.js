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
      'A4', 
      'B6',
      'C3',
      'D4',
      'E4',
      'F2',
      'G2',
      'H4',
      'J3',
      'K3',
      'L2',
      'M2',
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
  preferredTutors: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor'
      }
    ],
    validate: [
      preferredTutorsArrayLimit, 
      'each student should have a maximum of 3 preferred tutors'
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
      date: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Saturdate'
      }
    }
  ],
  comments: [
    {
      // Shift to attendance?
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comments'
    }
  ],
  attending: {
    type: Boolean,
    required: true
  }
})

function preferredTutorsArrayLimit (val) {
  return val.length <= 3
}

PreSchoolSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('the name you provided is already in use'))
  } else {
    next(error)
  }
})

var PreSchool = mongoose.model('PreSchool', PreSchoolSchema)

module.exports = PreSchool
