var Comment = require('../models/comment')
var Saturdate = require('../models/saturdate')
var PreSchool = require('../models/preSchool')
var Fitzroy = require('../models/fitzroy')
var PostFitzroy = require('../models/postFitzroy')
var Tutor = require('../models/tutor')

var sortByProperty = require('../helpers/sortByProperty')
var formatDateShort = require('../helpers/formatDateShort')
var formatDateLong = require('../helpers/formatDateLong')

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
            allComments: sortByProperty(allComments, 'date', true),
            formatDateShort: formatDateShort
          })
        }
      })
  },

  show: function (req, res) {
    Comment.findById(req.params.id)
      .populate('date')
      .populate('tutor')
      .populate('preSchools')
      .populate('fitzroys')
      .populate('postFitzroys')
      .exec(function (err, chosenComment) {
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
                          allTutors: sortByProperty(allTutors, 'name'),
                          allPreSchools: sortByProperty(allPreSchools, 'name'),
                          allFitzroys: sortByProperty(allFitzroys, 'name'),
                          allPostFitzroys: sortByProperty(allPostFitzroys, 'name'),
                          allSaturdates: sortByProperty(allSaturdates, 'date', true),
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

  edit: function (req, res) {
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
                        Comment.findById(req.params.id)
                          .populate('date')
                          .populate('tutor')
                          .populate('preSchools')
                          .populate('fitzroys')
                          .populate('postFitzroys')
                          .exec(function (err, chosenComment) {
                            if (err) {
                              req.flash('error', err.toString())
                              res.redirect('/comments')
                            } else {
                              res.render('comments/edit', {
                                allTutors: sortByProperty(allTutors, 'name'),
                                allPreSchools: sortByProperty(allPreSchools, 'name'),
                                allFitzroys: sortByProperty(allFitzroys, 'name'),
                                allPostFitzroys: sortByProperty(allPostFitzroys, 'name'),
                                allSaturdates: sortByProperty(allSaturdates, 'date', true),
                                chosenComment: chosenComment,
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
      }
    })
  },

  update: function (req, res) {
    Comment.findOneAndUpdate({ _id: req.params.id}, {
      date: req.body.date,
      tutor: req.body.tutor,
      preSchools: req.body.preSchools || [],
      fitzroys: req.body.fitzroys || [],
      postFitzroys: req.body.postFitzroys || [],
      contents: req.body.contents
    }, { runValidators: true }, function (err, chosenComment) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/comments/edit/' + req.params.id)
      } else {
        req.flash('success', 'Comment successfully updated!')
        res.redirect('/comments/' + chosenComment.id)
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