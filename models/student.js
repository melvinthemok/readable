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
      'please specify this student\'s school level'
    ]
  },
  startDate: {
    type: Date,
    required: [
      true,
      'please specify when this student joined ReadAble'
    ]
  },
  category: {
    type: String,
    enum: ['pre-school', 'Fitzroy', 'Fitzroy-1v1', 'post-Fitzroy'],
    required: [
      true,
      'please specify this student\'s category'
    ]
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
      ref: 'Student'
    }
  ],
  fitzroyBooksDone: [
    {
      book: {
        type: Number,
        min: [
          1,
          'the lowest Fitzroy level is 1'
        ],
        max: [
          60,
          'the highest Fitzroy level is 60'
        ],
        required: [
          true,
          'please specify a Fitzroy level'
        ]
      },
      date: {
        type: Date,
        required: [
          true,
          'please specify the date this Fitzroy level was completed'
        ]
      }
    }
  ],
  fitzroyBooksInProgress: [
    {
      book: {
        type: Number,
        min: [
          1,
          'the lowest Fitzroy level is 1'
        ],
        max: [
          60,
          'the highest Fitzroy level is 60'
        ],
        required: [
          true,
          'please specify a Fitzroy level'
        ]
      },
      date: {
        type: Date,
        required: [
          true,
          'please specify the date this Fitzroy level was commenced'
        ]
      }
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comments'
    }
  ],
  password: {
    type: String
    // required: [
    //   true,
    //   'a password is required'
    // ],
    // minlength: [
    //   8,
    //   'your password must be between 8 and 30 characters'
    // ],
    // maxlength: [
    //   30,
    //   'your password must be between 8 and 30 characters'
    // ]
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

function preferredTutorsArrayLimit (val) {
  return val.length <= 3
}

StudentSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('the name you provided is already in use'))
  } else {
    next(error)
  }
})

var Student = mongoose.model('Student', StudentSchema)

module.exports = Student
