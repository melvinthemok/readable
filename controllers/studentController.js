var Fitzroy = require('../models/fitzroy')
var PreSchool = require('../models/preSchool')
var PostFitzroy = require('../models/postFitzroy')
var Tutor = require('../models/tutor')
var Saturdate = require('../models/saturdate')
var Comment = require('../models/comment')

var formatDateShort = require('../helpers/formatDateShort')
var formatDateLong = require('../helpers/formatDateLong')
var fitzroyBookLevelPlusX = require('../helpers/fitzroyBookLevelPlusX')

var studentController = {
  index: function (req, res) {
    res.render('students/index')
  },

  new: function (req, res) {
    res.render('students/new')
  },

  preSchool: {
    
    index: function (req, res) {
      PreSchool.find({}, function (err, allPreSchools) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students')
        } else {
          res.render('students/preSchool/index', {
            allPreSchools: allPreSchools.sort(function (preSchool1, preSchool2) {
              if (preSchool1.name < preSchool2.name) return -1
              else if (preSchool1.name > preSchool2.name) return 1
              else return 0
            })
          })
        }
      })
    },

    show: function (req, res) {
      PreSchool.findById(req.params.id)
        .populate('kidsToAvoid')
        .populate('preferredTutors')
        .populate({
          path: 'attendance.date',
          model: 'Saturdate'
        })
        .populate({
          path: 'attendance.tutor',
          model: 'Tutor'
        })
        .exec(function (err, chosenPreSchool) {
          if (err) {
            req.flash('error', err.toString())
            res.redirect('/students/pre-school')
          } else {
            Comment.find({})
              .populate('date')
              .populate('preSchools')
              .exec(function (err, allComments) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/pre-school')
                } else {
                  res.render('students/preSchool/show', {
                    chosenPreSchool: chosenPreSchool,
                    allComments: allComments.filter(function (comment) {
                      return comment.preSchools.some(function(preSchool) {
                        return preSchool.equals(chosenPreSchool.id)
                      })
                    }),
                    formatDateShort: formatDateShort
                  })
                }
              })
          }
        })
    },

    new: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/pre-school')
        } else {
          PreSchool.find({}, function (err, allPreSchools) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/pre-school')
            } else {
              Saturdate.find({}, function (err, allSaturdates) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/pre-school')
                } else {
                  res.render('students/preSchool/new', {
                    allTutors: allTutors,
                    allPreSchools: allPreSchools,
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
    },

    create: function (req, res) {
      var newPreSchool = new PreSchool({
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        family: req.body.family,
        startDate: req.body.startDate,
        oneOnOne: req.body.oneOnOne,
        intervention: req.body.intervention,
        generalComment: req.body.generalComment,
        preferredTutors: req.body.preferredTutors,
        kidsToAvoid: req.body.kidsToAvoid,
        attendance: typeof req.body.saturdates === 'string'
        ? req.body.preSchoolTutors === 'unknown'
          ? { date: req.body.saturdates }
          : { tutor: req.body.preSchoolTutors, date: req.body.saturdates }
        : req.body.saturdates
          ? req.body.saturdates.map(function (date) {
            var obj = {}
            obj['date'] = date
            req.body.preSchoolTutors[0] === 'unknown'
            ? req.body.preSchoolTutors.shift()
            : obj['tutor'] = req.body.preSchoolTutors.shift()
            return obj
          })
          : [],
        attending: false
      })
      newPreSchool.save(function (err, savedPreSchool) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/pre-school/new')
        } else {
          PreSchool.update(
            { _id: { $in: savedPreSchool.kidsToAvoid }},
            { $addToSet: { kidsToAvoid: savedPreSchool.id }},
            { multi: true },
            function (err) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/pre-school/new')
              } else {
                req.flash('success', savedPreSchool.name + ' successfully signed up!')
                res.redirect('/students/pre-school')
              }
            }
          )
        }
      })
    },

    edit: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/pre-school')
        } else {
          PreSchool.find({}, function (err, allPreSchools) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/pre-school')
            } else {
              Saturdate.find({}, function (err, allSaturdates) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/pre-school')
                } else {
                  PreSchool.findById(req.params.id)
                    .populate('preferredTutors')
                    .populate('kidsToAvoid')
                    .populate({
                      path: 'attendance.date',
                      model: 'Saturdate'
                    })
                    .populate({
                      path: 'attendance.tutor',
                      model: 'Tutor'
                    })
                    .exec(function (err, chosenPreSchool) {
                      if (err) {
                        req.flash('error', err.toString())
                        res.redirect('/students/pre-school')
                      } else {
                        res.render('students/preSchool/edit', {
                          allTutors: allTutors,
                          allPreSchools: allPreSchools,
                          allSaturdates: allSaturdates.sort(function (date1, date2) {
                            if (date1.date < date2.date) return -1
                            else if (date1.date > date2.date) return 1
                            else return 0
                          }),
                          chosenPreSchool: chosenPreSchool,
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
    },

    update: function (req, res) {
      PreSchool.findById(req.params.id, function (err, chosenPreSchool) {
        chosenPreSchool.name = req.body.name
        chosenPreSchool.gender = req.body.gender
        chosenPreSchool.age = req.body.age
        chosenPreSchool.family = req.body.family
        chosenPreSchool.startDate = req.body.startDate
        chosenPreSchool.oneOnOne = req.body.oneOnOne
        chosenPreSchool.intervention = req.body.intervention
        chosenPreSchool.generalComment = req.body.generalComment
        chosenPreSchool.preferredTutors = req.body.preferredTutors || []
        chosenPreSchool.kidsToAvoid = req.body.kidsToAvoid || []
        chosenPreSchool.attendance = typeof req.body.saturdates === 'string'
          ? req.body.preSchoolTutors === 'unknown'
            ? { date: req.body.saturdates }
            : { tutor: req.body.preSchoolTutors, date: req.body.saturdates }
          : req.body.saturdates
            ? req.body.saturdates.map(function (date) {
              var obj = {}
              obj['date'] = date
              req.body.preSchoolTutors[0] === 'unknown'
              ? req.body.preSchoolTutors.shift()
              : obj['tutor'] = req.body.preSchoolTutors.shift()
              return obj
            })
            : []
        chosenPreSchool.attending = false
        chosenPreSchool.save(function (err) {
          if (err) {
            req.flash('error', err.toString())
            res.redirect('/students/pre-school/edit/' + req.params.id)
          }
        })
        PreSchool.update(
          { _id: { $in: chosenPreSchool.kidsToAvoid }},
          { $addToSet: { kidsToAvoid: chosenPreSchool.id }},
          { multi: true },
          function (err) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/pre-school/edit/' + req.params.id)
            } else {
              PreSchool.update(
                { _id: { $nin: chosenPreSchool.kidsToAvoid }},
                { $pull: { kidsToAvoid: chosenPreSchool.id }},
                { multi: true },
                function (err) {
                  if (err) {
                    req.flash('error', err.toString())
                    res.redirect('/students/pre-school/edit/' + req.params.id)
                  } else {
                    req.flash('success', chosenPreSchool.name + '\'s details successfully updated!')
                    res.redirect('/students/pre-school/' + chosenPreSchool.id)
                  }
                })
            }
          }
        )
      })
    }    
  },

  fitzroy: {

    index: function (req, res) {
      Fitzroy.find({}, function (err, allFitzroys) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students')
        } else {
          res.render('students/fitzroy/index', {
            allFitzroys: allFitzroys.sort(function (fitzroy1, fitzroy2) {
              if (fitzroy1.name < fitzroy2.name) return -1
              else if (fitzroy1.name > fitzroy2.name) return 1
              else return 0
            })
          })
        }
      })
    },

    show: function (req, res) {
      Fitzroy.findById(req.params.id)
        .populate('kidsToAvoid')
        .populate('preferredTutors')
        .populate({
          path: 'attendance.date',
          model: 'Saturdate'
        })
        .populate({
          path: 'attendance.tutor',
          model: 'Tutor'
        })
        .exec(function (err, chosenFitzroy) {
          if (err) {
            req.flash('error', err.toString())
            res.redirect('/students/fitzroy')
          } else {
            Comment.find({})
              .populate('date')
              .populate('fitzroys')
              .exec(function (err, allComments) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/fitzroy')
                } else {
                  res.render('students/fitzroy/show', {
                    chosenFitzroy: chosenFitzroy,
                    allComments: allComments.filter(function (comment) {
                      return comment.fitzroys.some(function(fitzroy) {
                        return fitzroy.equals(chosenFitzroy.id)
                      })
                    }),
                    formatDateShort: formatDateShort,
                    fitzroyBookLevelPlusX: fitzroyBookLevelPlusX
                  })
                }
              })
          }
        })
    },

    new: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/fitzroy')
        } else {
          Fitzroy.find({}, function (err, allFitzroys) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/fitzroy')
            } else {
              Saturdate.find({}, function (err, allSaturdates) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/fitzroy')
                } else {
                  res.render('students/fitzroy/new', {
                    allTutors: allTutors,
                    allFitzroys: allFitzroys,
                    allSaturdates: allSaturdates.sort(function (date1, date2) {
                      if (date1.date < date2.date) return -1
                      else if (date1.date > date2.date) return 1
                      else return 0
                    }),
                    formatDateLong: formatDateLong,
                    fitzroyBookLevelPlusX: fitzroyBookLevelPlusX
                  })
                }
              })
            }
          })
        }
      })
    },

    create: function (req, res) {
      var newFitzroy = new Fitzroy({
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        family: req.body.family,
        schoolLevel: req.body.schoolLevel,
        startDate: req.body.startDate,
        oneOnOne: req.body.oneOnOne,
        intervention: req.body.intervention,
        generalComment: req.body.generalComment,
        preferredTutors: req.body.preferredTutors,
        kidsToAvoid: req.body.kidsToAvoid,
        attendance: typeof req.body.fitzroyBooks === 'string'
          ? req.body.fitzroyTutors === 'unknown'
            ? { book: req.body.fitzroyBooks, date: req.body.saturdates, completed: req.body.fitzroyCompleted }
            : { tutor: req.body.fitzroyTutors, book: req.body.fitzroyBooks, date: req.body.saturdates, completed: req.body.fitzroyCompleted }
          : req.body.fitzroyBooks
            ? req.body.fitzroyBooks.map(function (book) {
              var obj = {}
              req.body.fitzroyTutors[0] === 'unknown'
              ? req.body.fitzroyTutors.shift()
              : obj['tutor'] = req.body.fitzroyTutors.shift()
              obj['book'] = book
              obj['date'] = req.body.saturdates.shift()
              if (req.body.fitzroyCompleted) {
                if (obj['book'] !== '0') {
                  typeof req.body.fitzroyCompleted === 'string'
                    ? obj['completed'] = req.body.fitzroyCompleted
                    : obj['completed'] = req.body.fitzroyCompleted.shift()
                }
              }
              return obj
            })
            : [],
        attending: false
      })
      newFitzroy.save(function (err, savedFitzroy) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/fitzroy/new')
        } else {
          Fitzroy.update(
            { _id: { $in: savedFitzroy.kidsToAvoid }},
            { $addToSet: { kidsToAvoid: savedFitzroy.id } },
            { multi: true },
            function (err) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/fitzroy/new')
              } else {
                req.flash('success', savedFitzroy.name + ' successfully signed up!')
                res.redirect('/students/fitzroy')
              }
            }
          )
        }
      })
    },

    edit: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/fitzroy')
        } else {
          Fitzroy.find({}, function (err, allFitzroys) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/fitzroy')
            } else {
              Saturdate.find({}, function (err, allSaturdates) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/fitzroy')
                } else {
                  Fitzroy.findById(req.params.id)
                    .populate('preferredTutors')
                    .populate('kidsToAvoid')
                    .populate({
                      path: 'attendance.date',
                      model: 'Saturdate'
                    })
                    .populate({
                      path: 'attendance.tutor',
                      model: 'Tutor'
                    })
                    .exec(function (err, chosenFitzroy) {
                      if (err) {
                        req.flash('error', err.toString())
                        res.redirect('/students/fitzroy')
                      } else {
                        res.render('students/fitzroy/edit', {
                          allTutors: allTutors,
                          allFitzroys: allFitzroys,
                          allSaturdates: allSaturdates.sort(function (date1, date2) {
                            if (date1.date < date2.date) return -1
                            else if (date1.date > date2.date) return 1
                            else return 0
                          }),
                          chosenFitzroy: chosenFitzroy,
                          formatDateLong: formatDateLong,
                          fitzroyBookLevelPlusX: fitzroyBookLevelPlusX
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

      // when a Saturdate is unchecked
      // the former values of book, tutor, and completed
      // are replaced by empty strings
      // remove these empty strings before processing attendance

      if (typeof req.body.fitzroyBooks !== 'string') {
        req.body.fitzroyBooks = req.body.fitzroyBooks.filter(function(book) { return book !== '' })
      }
      if (typeof req.body.fitzroyTutors !== 'string') {
        req.body.fitzroyTutors = req.body.fitzroyTutors.filter(function(tutor) { return tutor !== '' })
      }
      if (typeof req.body.fitzroyCompleted !== 'string') {
        req.body.fitzroyCompleted = req.body.fitzroyCompleted.filter(function(completed) { return completed !== '' })
      }

      Fitzroy.findById(req.params.id, function (err, chosenFitzroy) {
        chosenFitzroy.name = req.body.name
        chosenFitzroy.gender = req.body.gender
        chosenFitzroy.age = req.body.age
        chosenFitzroy.family = req.body.family
        chosenFitzroy.schoolLevel = req.body.schoolLevel
        chosenFitzroy.startDate = req.body.startDate
        chosenFitzroy.oneOnOne = req.body.oneOnOne
        chosenFitzroy.intervention = req.body.intervention
        chosenFitzroy.generalComment = req.body.generalComment
        chosenFitzroy.preferredTutors = req.body.preferredTutors || []
        chosenFitzroy.kidsToAvoid = req.body.kidsToAvoid || []
        chosenFitzroy.attendance = typeof req.body.fitzroyBooks === 'string'
          ? req.body.fitzroyTutors === 'unknown'
              ? { book: req.body.fitzroyBooks, date: req.body.saturdates, completed: req.body.fitzroyCompleted }
              : { tutor: req.body.fitzroyTutors, book: req.body.fitzroyBooks, date: req.body.saturdates, completed: req.body.fitzroyCompleted }
          : req.body.fitzroyBooks
            ? req.body.fitzroyBooks.map(function (book) {
              var obj = {}
              req.body.fitzroyTutors[0] === 'unknown'
                ? req.body.fitzroyTutors.shift()
                : obj['tutor'] = req.body.fitzroyTutors.shift()
              obj['book'] = book
              typeof req.body.saturdates === 'string'
                ? obj['date'] = req.body.saturdates
                : obj['date'] = req.body.saturdates.shift()
              if (req.body.fitzroyCompleted) {
                if (obj['book'] !== '0') {
                  typeof req.body.fitzroyCompleted === 'string'
                    ? obj['completed'] = req.body.fitzroyCompleted
                    : obj['completed'] = req.body.fitzroyCompleted.shift()
                }
              }
              return obj
            })
            : []
        chosenFitzroy.attending = false
        chosenFitzroy.save(function (err) {
          if (err) {
            req.flash('error', err.toString())
            res.redirect('/students/fitzroy/edit/' + req.params.id)
          }
        })
        Fitzroy.update(
          { _id: { $in: chosenFitzroy.kidsToAvoid }},
          { $addToSet: { kidsToAvoid: chosenFitzroy.id }},
          { multi: true },
          function (err) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/fitzroy/edit/' + req.params.id)
            } else {
              Fitzroy.update(
                { _id: { $nin: chosenFitzroy.kidsToAvoid }},
                { $pull: { kidsToAvoid: chosenFitzroy.id }},
                { multi: true },
                function (err) {
                  if (err) {
                    req.flash('error', err.toString())
                    res.redirect('/students/fitzroy/edit/' + req.params.id)
                  } else {
                    req.flash('success', chosenFitzroy.name + '\'s details successfully updated!')
                    res.redirect('/students/fitzroy/' + chosenFitzroy.id)
                  }
                })
            }
          }
        )
      })
    }
  },

  postFitzroy: {
    
    index: function (req, res) {
      PostFitzroy.find({}, function (err, allPostFitzroys) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students')
        } else {
          res.render('students/postFitzroy/index', {
            allPostFitzroys: allPostFitzroys.sort(function (postFitzroy1, postFitzroy2) {
              if (postFitzroy1.name < postFitzroy2.name) return -1
              else if (postFitzroy1.name > postFitzroy2.name) return 1
              else return 0
            })
          })
        }
      })
    },

    show: function (req, res) {
      PostFitzroy.findById(req.params.id)
        .populate('kidsToAvoid')
        .populate('preferredTutors')
        .populate({
          path: 'attendance.date',
          model: 'Saturdate'
        })
        .populate({
          path: 'attendance.tutor',
          model: 'Tutor'
        })
        .exec(function (err, chosenPostFitzroy) {
          if (err) {
            req.flash('error', err.toString())
            res.redirect('/students/post-fitzroy')
          } else {
            Comment.find({})
            .populate('date')
            .populate('postFitzroys')
            .exec(function (err, allComments) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/post-fitzroy')
              } else {
                res.render('students/postFitzroy/show', {
                  chosenPostFitzroy: chosenPostFitzroy,
                  allComments: allComments.filter(function (comment) {
                    return comment.postFitzroys.some(function(postFitzroy) {
                      return postFitzroy.equals(chosenPostFitzroy.id)
                    })
                  }),
                  formatDateShort: formatDateShort
                })
              }
            })
          }
        })
    },

    new: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/post-fitzroy')
        } else {
          PostFitzroy.find({}, function (err, allPostFitzroys) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/post-fitzroy')
            } else {
              Saturdate.find({}, function (err, allSaturdates) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/post-fitzroy')
                } else {
                  res.render('students/postFitzroy/new', {
                    allTutors: allTutors,
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
    },

    create: function (req, res) {
      var newPostFitzroy = new PostFitzroy({
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        family: req.body.family,
        schoolLevel: req.body.schoolLevel,
        startDate: req.body.startDate,
        oneOnOne: req.body.oneOnOne,
        intervention: req.body.intervention,
        generalComment: req.body.generalComment,
        preferredTutors: req.body.preferredTutors,
        kidsToAvoid: req.body.kidsToAvoid,
        attendance: typeof req.body.saturdates === 'string'
        ? req.body.postFitzroyTutors === 'unknown'
          ? { date: req.body.saturdates }
          : { tutor: req.body.postFitzroyTutors, date: req.body.saturdates }
        : req.body.saturdates
          ? req.body.saturdates.map(function (date) {
            var obj = {}
            obj['date'] = date
            req.body.postFitzroyTutors[0] === 'unknown'
            ? req.body.postFitzroyTutors.shift()
            : obj['tutor'] = req.body.postFitzroyTutors.shift()
            return obj
          })
          : [],
        attending: false
      })
      newPostFitzroy.save(function (err, savedPostFitzroy) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/post-fitzroy/new')
        } else {
          PostFitzroy.update(
            { _id: { $in: savedPostFitzroy.kidsToAvoid }},
            { $addToSet: { kidsToAvoid: savedPostFitzroy.id }},
            { multi: true },
            function (err) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/post-fitzroy/new')
              } else {
                req.flash('success', savedPostFitzroy.name + ' successfully signed up!')
                res.redirect('/students/post-fitzroy')
              }
            }
          )
        }
      })
    },

    edit: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/post-fitzroy')
        } else {
          PostFitzroy.find({}, function (err, allPostFitzroys) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/post-fitzroy')
            } else {
              Saturdate.find({}, function (err, allSaturdates) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/post-fitzroy')
                } else {
                  PostFitzroy.findById(req.params.id)
                    .populate('preferredTutors')
                    .populate('kidsToAvoid')
                    .populate({
                      path: 'attendance.date',
                      model: 'Saturdate'
                    })
                    .populate({
                      path: 'attendance.tutor',
                      model: 'Tutor'
                    })
                    .exec(function (err, chosenPostFitzroy) {
                      if (err) {
                        req.flash('error', err.toString())
                        res.redirect('/students/post-fitzroy')
                      } else {
                        res.render('students/postFitzroy/edit', {
                          allTutors: allTutors,
                          allPostFitzroys: allPostFitzroys,
                          allSaturdates: allSaturdates.sort(function (date1, date2) {
                            if (date1.date < date2.date) return -1
                            else if (date1.date > date2.date) return 1
                            else return 0
                          }),
                          chosenPostFitzroy: chosenPostFitzroy,
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
    },

    update: function (req, res) {
      PostFitzroy.findById(req.params.id, function (err, chosenPostFitzroy) {
        chosenPostFitzroy.name = req.body.name
        chosenPostFitzroy.gender = req.body.gender
        chosenPostFitzroy.age = req.body.age
        chosenPostFitzroy.family = req.body.family
        chosenPostFitzroy.schoolLevel = req.body.schoolLevel
        chosenPostFitzroy.startDate = req.body.startDate
        chosenPostFitzroy.oneOnOne = req.body.oneOnOne
        chosenPostFitzroy.intervention = req.body.intervention
        chosenPostFitzroy.generalComment = req.body.generalComment
        chosenPostFitzroy.preferredTutors = req.body.preferredTutors || []
        chosenPostFitzroy.kidsToAvoid = req.body.kidsToAvoid || []
        chosenPostFitzroy.attendance = typeof req.body.saturdates === 'string'
          ? req.body.postFitzroyTutors === 'unknown'
            ? { date: req.body.saturdates }
            : { tutor: req.body.postFitzroyTutors, date: req.body.saturdates }
          : req.body.saturdates
            ? req.body.saturdates.map(function (date) {
              var obj = {}
              obj['date'] = date
              req.body.postFitzroyTutors[0] === 'unknown'
              ? req.body.postFitzroyTutors.shift()
              : obj['tutor'] = req.body.postFitzroyTutors.shift()
              return obj
            })
            : []
        chosenPostFitzroy.attending = false
        chosenPostFitzroy.save(function (err) {
          if (err) {
            req.flash('error', err.toString())
            res.redirect('/students/post-fitzroy/edit/' + req.params.id)
          }
        })
        PostFitzroy.update(
          { _id: { $in: chosenPostFitzroy.kidsToAvoid }},
          { $addToSet: { kidsToAvoid: chosenPostFitzroy.id }},
          { multi: true },
          function (err) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/post-fitzroy/edit/' + req.params.id)
            } else {
              PostFitzroy.update(
                { _id: { $nin: chosenPostFitzroy.kidsToAvoid }},
                { $pull: { kidsToAvoid: chosenPostFitzroy.id }},
                { multi: true },
                function (err) {
                  if (err) {
                    req.flash('error', err.toString())
                    res.redirect('/students/post-fitzroy/edit/' + req.params.id)
                  } else {
                    req.flash('success', chosenPostFitzroy.name + '\'s details successfully updated!')
                    res.redirect('/students/post-fitzroy/' + chosenPostFitzroy.id)
                  }
                })
            }
          }
        )
      })
    }
  }

}

module.exports = studentController
