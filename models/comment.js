var mongoose = require('mongoose')

var CommentSchema = new mongoose.Schema({
  date: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Saturdate',
    required: [
      true,
      'please specify the date of this comment'
    ]
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: [
      true,
      'please specify the tutor leaving this comment'
    ]
  },
  preSchools: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PreSchool'
    }
  ],
  fitzroys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fitzroy'
    }
  ],
  postFitzroys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PostFitzroy'
    }
  ],
  contents: {
    type: String,
    maxLength: [
      500,
      'please keep the comment within 500 characters'
    ],
    required: [
      true,
      'please include some contents within this comment'
    ]
  }
})

var Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
