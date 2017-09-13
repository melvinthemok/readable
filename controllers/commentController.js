var Comment = require('../models/comment')
var Saturdate = require('../models/saturdate')
var PreSchool = require('../models/preSchool')
var Fitzroy = require('../models/fitzroy')
var PostFitzroy = require('../models/postFitzroy')
var Tutor = require('../models/tutor')
var formatDateShort = require('../public/client_side_helpers/formatDateShort')
var formatDateLong = require('../public/client_side_helpers/formatDateLong')

var commentController = {
  index: function (req, res) {
    Comment.find({}) 
      .populate('date')
      .populate('tutor')
      .populate('preSchools')
      .populate('fitzroys')
      .populate('postFitzroys')
      .exec(function (err, allComments) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/')
        } else {
          res.render('comments/index', {
            allComments: allComments.sort(function (comment1, comment2) {
              if (comment1.date < comment2.date) return -1
              else if (comment1.date > comment2.date) return 1
              else return 0
            }),
            formatDateShort: formatDateShort
          })
        }
      })
  },

  show: function (req, res) {
    Comment.findById(req.params.id, function (err, chosenComment) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/comments')
      } else {
        res.render('comments/show', {
          chosenComment: chosenComment,
          formatDateLong: formatDateLong
        })
      }
    })
  },

  new: function (req, res) {
    Tutor.find({}, function (err, allTutors) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/comments')
      } else {
        PreSchool.find({}, function (err, allPreSchools) {
          if (err) {
            req.flash('error', err.toString())
            res.redirect('/comments')
          } else {
            Fitzroy.find({}, function (err, allFitzroys) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/comments')
              } else {
                PostFitzroy.find({}, function (err, allPostFitzroys) {
                  if (err) {
                    req.flash('error', err.toString())
                    res.redirect('/comments')
                  } else {
                    Saturdate.find({}, function (err, allSaturdates) {
                      if (err) {
                        req.flash('error', err.toString())
                        res.redirect('/comments')
                      } else {
                        res.render('comments/new', {
                          allTutors: allTutors,
                          allPreSchools: allPreSchools,
                          allFitzroys: allFitzroys,
                          allPostFitzroys: allPostFitzroys,
                          allSaturdates: allSaturdates.sort(function (date1, date2) {
                            if (date1.date < date2.date) return -1
                            else if (date1.date > date2.date) return 1
                            else return 0
                          }),
                          formatDateLong: formatDateLong
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  },

  create: function (req, res) {
    var newComment = new Comment({
      date: req.body.date,
      tutor: req.body.tutor,
      preSchools: req.body.preSchools,
      fitzroys: req.body.fitzroys,
      postFitzroys: req.body.postFitzroys,
      contents: req.body.contents
    })
    newComment.save(function (err, savedComment) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/comments/new')
      } else {
        req.flash('success', 'Comment successfully added!')
        res.redirect('/comments')
      }
    })
  },

  delete: function (req, res) {
    Comment.findByIdAndRemove(req.params.id, function (err, chosenComment) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/comments')
      } else {
        req.flash('success', 'Comment successfully deleted!')
        res.redirect('/comments')
      }
    })
  }

}

module.exports = commentController