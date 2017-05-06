var mongoose = require('mongoose')

var StudentSchema = new mongoose.Schema({
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
      'please provide your student\'s gender'
    ]
  },
  age: {
    type: Number,
    min: [
      5,
      'your student\'s age must be between ages 4 and 21 to qualify'
    ],
    max: [
      20,
      'your student\'s age must be between ages 4 and 21 to qualify'
    ],
    required: [
      true,
      'please specify your student\'s age'
    ]
  },
  schoolLevel: {
    type: String,
    enum: [
      'Pre-primary', 
      'Primary 1',
      'Primary 2',
      'Primary 3',
      'Primary 4',
      'Primary 5',
      'Primary 6',
      'Secondary 1',
      'Secondary 2',
      'Secondary 3',
      'Secondary 4',
      'Secondary 5'
    ],
    required: [
      true,
      'please specify your student\'s school level'
    ]
  },
  startDate: {
    type: Date,
    required: [
      true,
      'please specify when you joined ReadAble'
    ]
  },
  booksDone: [
    {
      type: Number 
    }
  ],
  currentBook: {
    type: Number
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comments'
    }
  ],
  preferredTutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor'
  },
  kidsToAvoid: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],
  password: {
    type: String
  },
  userType: {
    type: String
    // required: true,
    // default: 'student'
  },
  attending: {
    type: Boolean,
    required: true
  }
})

var Student = mongoose.model('Student', StudentSchema)

module.exports = Student
