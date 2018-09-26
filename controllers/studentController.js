var Fitzroy = require('../models/fitzroy')
var PreSchool = require('../models/preSchool')
var PostFitzroy = require('../models/postFitzroy')
var Tutor = require('../models/tutor')
var Saturdate = require('../models/saturdate')
var Comment = require('../models/comment')

var formatDateShort = require('../helpers/formatDateShort')
var formatDateLong = require('../helpers/formatDateLong')
var sortByProperty = require('../helpers/sortByProperty')
var fitzroyBookLevelPlusX = require('../helpers/fitzroyBookLevelPlusX')
var filterStudentPrefixedKeys = require('../helpers/filterStudentPrefixedKeys')

var studentController = {
  index: function (req, res) {
    res.render('students/index')
  },

  new: function (req, res) {
    res.render('students/new')
  },

  preSchool: {

    index: function (req, res) {
      PreSchool.find({
        $or: [
          { archived: { $exists: false } },
          { archived: false }
        ]
      }, function (err, allPreSchools) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students')
        } else {
          res.render('students/preSchool/index', {
            allPreSchools: sortByProperty(allPreSchools, 'name')
          })
        }
      })
    },

    indexArchived: function (req, res) {
      PreSchool.find({
        archived: true
      }, function (err, allPreSchools) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students')
        } else {
          res.render('students/preSchool/index-archived', {
            allPreSchools: sortByProperty(allPreSchools, 'name')
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
                  Saturdate.findOne({
                    date: {
                      $gt: Date.now() - 64 * 60 * 60 * 1000,
                      $lte: Date.now() + 8 * 60 * 60 * 1000
                    }
                  }, function (err, latestSaturdate) {
                    if (err) {
                      req.flash('error', err.toString())
                      res.redirect('/students/fitzroy')
                    } else {
                      res.render('students/preSchool/show', {
                        chosenPreSchool: chosenPreSchool,
                        allComments: allComments.filter(function (comment) {
                          return comment.preSchools.some(function(preSchool) {
                            return preSchool.equals(chosenPreSchool.id)
                          })
                        }),
                        formatDateShort: formatDateShort,
                        sortByProperty: sortByProperty,
                        latestSaturdate: latestSaturdate
                      })
                    }
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
          PreSchool.find({
            $or: [
              { archived: { $exists: false } },
              { archived: false }
            ]
          }, function (err, allPreSchools) {
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
                    allTutors: sortByProperty(allTutors, 'name'),
                    allPreSchools: sortByProperty(allPreSchools, 'name'),
                    allSaturdates: sortByProperty(allSaturdates, 'date', true),
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
          : []
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
                          allTutors: sortByProperty(allTutors, 'name'),
                          allPreSchools: sortByProperty(allPreSchools, 'name'),
                          allSaturdates: sortByProperty(allSaturdates, 'date', true),
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
    },

    archive: function (req, res) {
      PreSchool.findById(req.params.id, function (err, chosenPreSchool) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/pre-school/' + req.params.id)
        } else {
          chosenPreSchool.archived = req.body.archived
          chosenPreSchool.save(function(err) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/pre-school/' + req.params.id)
            } else {
              req.flash('success', chosenPreSchool.name + '\'s status successfully updated')
              res.redirect('/students/pre-school/' + chosenPreSchool.id)
            }
          })
        }
      })
    },

    delete: function (req, res) {
      PreSchool.findById(req.params.id, function (err, chosenPreSchool) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/pre-school/')
        } else {
          PreSchool.update(
            { _id: { $in: chosenPreSchool.kidsToAvoid }},
            { $pull: { kidsToAvoid: chosenPreSchool.id }},
            { multi: true },
            function (err) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/pre-school/')
              } else {
                Comment.update(
                  { preSchools: { $elemMatch: { $eq: chosenPreSchool.id }}},
                  { $pull: { preSchools: chosenPreSchool.id }},
                  { multi: true },
                  function (err) {
                    if (err) {
                      req.flash('error', err.toString())
                      res.redirect('/students/pre-school/')
                    } else {
                      Comment.remove({ preSchools: { $exists: true, $eq: [] }}, function (err) {
                        if (err) {
                          req.flash('error', err.toString())
                          res.redirect('/students/pre-school/')
                        } else {
                          PreSchool.findByIdAndRemove(chosenPreSchool.id, function (err, chosenPreSchool) {
                            if (err) {
                              req.flash('error', err.toString())
                              res.redirect('/students/pre-school/')
                            } else {
                              req.flash('success', chosenPreSchool.name + ' successfully removed')
                              res.redirect('/students/pre-school/')
                            }
                          })
                        }
                      })
                    }
                  }
                )
              }
            }
          )
        }
      })
    },

    newAttend: function (req, res) {
      PreSchool.findById(req.params.id, function (err, chosenPreSchool) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/pre-school/')
        } else {
          Saturdate.findOne({
            date: {
              $gt: Date.now() - 64 * 60 * 60 * 1000,
              $lte: Date.now() + 8 * 60 * 60 * 1000
            }
          }, function (err, latestSaturdate) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/pre-school/')
            } else {
              Tutor.find({}, function (err, allTutors) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/pre-school/')
                } else {
                  if (latestSaturdate === null) {
                    req.flash('error', 'There doesn\'t seem to have been a recent session')
                    res.redirect('/students/pre-school/' + chosenPreSchool.id)
                  } else if (chosenPreSchool.attendance.some(function (indivAtten) {
                    return indivAtten.date.toString() === latestSaturdate.id.toString()
                  })) {
                    req.flash('error', 'Looks like the latest attendance was already created; edit it instead')
                    res.redirect('/students/pre-school/edit/' + chosenPreSchool.id)
                  } else {
                    res.render('students/preSchool/new-attend', {
                      chosenPreSchool: chosenPreSchool,
                      latestSaturdate: latestSaturdate,
                      formatDateLong: formatDateLong,
                      allTutors: allTutors
                    })
                  }
                }
              })
            }
          })
        }
      })
    },

    createAttend: function (req, res) {
      var newAttend = {
        date: req.body.date
      }
      if (req.body.tutor !== 'unknown') {
        newAttend.tutor = req.body.tutor
      }
      PreSchool.findById(req.params.id, function (err, chosenPreSchool) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/pre-school/')
        } else {
          if (chosenPreSchool.attendance.some(function (indivAtten) {
            return indivAtten.date.toString() === req.body.date
          })) {
            req.flash('error', 'Looks like the latest attendance was already created; edit it instead')
            res.redirect('/students/pre-school/edit/' + chosenPreSchool.id)
          } else {
            PreSchool.findByIdAndUpdate(req.params.id, {
              $push: {
                attendance: newAttend
              },
            }, {
              upsert: true
            }, function (err, chosenPreSchool) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/pre-school/' + req.params.id)
              } else {
                var newComment = new Comment({
                  date: req.body.date,
                  preSchools: [chosenPreSchool],
                  contents: req.body.comment
                })
                if (req.body.tutor !== 'unknown') {
                  newComment.tutor = req.body.tutor
                }
                newComment.save(function (err, savedComment) {
                  if (err) {
                    req.flash('error', err.toString())
                    res.redirect('/students/pre-school/' + req.params.id)
                  } else {
                    req.flash('success', 'Latest attendance of ' + chosenPreSchool.name + ' added!')
                    res.redirect('/students/pre-school/' + req.params.id)
                  }
                })
              }
            })
          }
        }
      })
    }    
  },

  fitzroy: {

    index: function (req, res) {
      Fitzroy.find({
        $or: [
          { archived: { $exists: false } },
          { archived: false }
        ]
      }, function (err, allFitzroys) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students')
        } else {
          res.render('students/fitzroy/index', {
            allFitzroys: sortByProperty(allFitzroys, 'name')
          })
        }
      })
    },

    indexArchived: function (req, res) {
      Fitzroy.find({
        archived: true
      }, function (err, allFitzroys) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students')
        } else {
          res.render('students/fitzroy/index-archived', {
            allFitzroys: sortByProperty(allFitzroys, 'name')
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
                  Saturdate.findOne({
                    date: {
                      $gt: Date.now() - 64 * 60 * 60 * 1000,
                      $lte: Date.now() + 8 * 60 * 60 * 1000
                    }
                  }, function (err, latestSaturdate) {
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
                        fitzroyBookLevelPlusX: fitzroyBookLevelPlusX,
                        latestSaturdate: latestSaturdate
                      })
                    }
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
          Fitzroy.find({
            $or: [
              { archived: { $exists: false } },
              { archived: false }
            ]
          }, function (err, allFitzroys) {
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
                    allTutors: sortByProperty(allTutors, 'name'),
                    allFitzroys: sortByProperty(allFitzroys, 'name'),
                    allSaturdates: sortByProperty(allSaturdates, 'date', true),
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
            : []
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
                          allTutors: sortByProperty(allTutors, 'name'),
                          allFitzroys: sortByProperty(allFitzroys, 'name'),
                          allSaturdates: sortByProperty(allSaturdates, 'date', true),
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

      // when a Saturdate is unchecked (not all)
      // the former values of book, tutor, and completed
      // are replaced by empty strings
      // remove these empty strings before processing attendance

      if (req.body.fitzroyBooks && typeof req.body.fitzroyBooks !== 'string') {
        req.body.fitzroyBooks = req.body.fitzroyBooks.filter(function(book) { return book !== '' })
      }
      if (req.body.fitzroyTutors && typeof req.body.fitzroyTutors !== 'string') {
        req.body.fitzroyTutors = req.body.fitzroyTutors.filter(function(tutor) { return tutor !== '' })
      }
      if (req.body.fitzroyCompleted && typeof req.body.fitzroyCompleted !== 'string') {
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
    },

    archive: function (req, res) {
      Fitzroy.findById(req.params.id, function (err, chosenFitzroy) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/fitzroy/' + req.params.id)
        } else {
          chosenFitzroy.archived = req.body.archived
          chosenFitzroy.save(function(err) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/fitzroy/' + req.params.id)
            } else {
              req.flash('success', chosenFitzroy.name + '\'s status successfully updated')
              res.redirect('/students/fitzroy/' + chosenFitzroy.id)
            }
          })
        }
      })
    },

    delete: function (req, res) {
      Fitzroy.findById(req.params.id, function (err, chosenFitzroy) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/fitzroy/')
        } else {
          Fitzroy.update(
            { _id: { $in: chosenFitzroy.kidsToAvoid }},
            { $pull: { kidsToAvoid: chosenFitzroy.id }},
            { multi: true },
            function (err) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/fitzroy/')
              } else {
                Comment.update(
                  { fitzroys: { $elemMatch: { $eq: chosenFitzroy.id }}},
                  { $pull: { fitzroys: chosenFitzroy.id }},
                  { multi: true },
                  function (err) {
                    if (err) {
                      req.flash('error', err.toString())
                      res.redirect('/students/fitzroy/')
                    } else {
                      Comment.remove({ fitzroys: { $exists: true, $eq: [] }}, function (err) {
                        if (err) {
                          req.flash('error', err.toString())
                          res.redirect('/students/fitzroy/')
                        } else {
                          Fitzroy.findByIdAndRemove(chosenFitzroy.id, function (err, chosenFitzroy) {
                            if (err) {
                              req.flash('error', err.toString())
                              res.redirect('/students/fitzroy/')
                            } else {
                              req.flash('success', chosenFitzroy.name + ' successfully removed')
                              res.redirect('/students/fitzroy/')
                            }
                          })
                        }
                      })
                    }
                  }
                )
              }
            }
          )
        }
      })
    },

    newAttend: function (req, res) {
      Fitzroy.findById(req.params.id, function (err, chosenFitzroy) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/fitzroy/')
        } else {
          Saturdate.findOne({
            date: {
              $gt: Date.now() - 64 * 60 * 60 * 1000,
              $lte: Date.now() + 8 * 60 * 60 * 1000
            }
          }, function (err, latestSaturdate) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/fitzroy/')
            } else {
              Tutor.find({}, function (err, allTutors) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/fitzroy/')
                } else {
                  if (latestSaturdate === null) {
                    req.flash('error', 'There doesn\'t seem to have been a recent session')
                    res.redirect('/students/fitzroy/' + chosenFitzroy.id)
                  } else if (chosenFitzroy.attendance.some(function (indivAtten) {
                    return indivAtten.date.toString() === latestSaturdate.id.toString()
                  })) {
                    req.flash('error', 'Looks like the latest attendance was already created; edit it instead')
                    res.redirect('/students/fitzroy/edit/' + chosenFitzroy.id)
                  } else {
                    res.render('students/fitzroy/new-attend', {
                      chosenFitzroy: chosenFitzroy,
                      latestSaturdate: latestSaturdate,
                      formatDateLong: formatDateLong,
                      allTutors: allTutors,
                      fitzroyBookLevelPlusX: fitzroyBookLevelPlusX
                    })
                  }
                }
              })
            }
          })
        }
      })
    },

    createAttend: function (req, res) {
      var newAttend = {
        date: req.body.date,
        book: req.body.book,
        completed: req.body.completed
      }
      if (req.body.tutor !== 'unknown') {
        newAttend.tutor = req.body.tutor
      }
      Fitzroy.findById(req.params.id, function (err, chosenFitzroy) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/fitzroy/')
        } else {
          if (chosenFitzroy.attendance.some(function (indivAtten) {
            return indivAtten.date.toString() === req.body.date
          })) {
            req.flash('error', 'Looks like the latest attendance was already created; edit it instead')
            res.redirect('/students/fitzroy/edit/' + chosenFitzroy.id)
          } else {
            Fitzroy.findByIdAndUpdate(req.params.id, {
              $push: {
                attendance: newAttend
              },
            }, {
              upsert: true
            }, function (err, chosenFitzroy) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/fitzroy/' + req.params.id)
              } else {
                var newComment = new Comment({
                  date: req.body.date,
                  fitzroys: [chosenFitzroy],
                  contents: req.body.comment
                })
                if (req.body.tutor !== 'unknown') {
                  newComment.tutor = req.body.tutor
                }
                newComment.save(function (err, savedComment) {
                  if (err) {
                    req.flash('error', err.toString())
                    res.redirect('/students/fitzroy/' + req.params.id)
                  } else {
                    req.flash('success', 'Latest attendance of ' + chosenFitzroy.name + ' added!')
                    res.redirect('/students/fitzroy/' + req.params.id)
                  }
                })
              }
            })
          }
        }
      })
    }
  },

  postFitzroy: {

    index: function (req, res) {
      PostFitzroy.find({
        $or: [
          { archived: { $exists: false } },
          { archived: false }
        ]
      }, function (err, allPostFitzroys) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students')
        } else {
          res.render('students/postFitzroy/index', {
            allPostFitzroys: sortByProperty(allPostFitzroys, 'name')
          })
        }
      })
    },

    indexArchived: function (req, res) {
      PostFitzroy.find({
        archived: true
      }, function (err, allPostFitzroys) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students')
        } else {
          res.render('students/postFitzroy/index-archived', {
            allPostFitzroys: sortByProperty(allPostFitzroys, 'name')
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
                Saturdate.findOne({
                  date: {
                    $gt: Date.now() - 64 * 60 * 60 * 1000,
                    $lte: Date.now() + 8 * 60 * 60 * 1000
                  }
                }, function (err, latestSaturdate) {
                  if (err) {
                    req.flash('error', err.toString())
                    res.redirect('/students/fitzroy')
                  } else {
                    res.render('students/postFitzroy/show', {
                      chosenPostFitzroy: chosenPostFitzroy,
                      allComments: allComments.filter(function (comment) {
                        return comment.postFitzroys.some(function(postFitzroy) {
                          return postFitzroy.equals(chosenPostFitzroy.id)
                        })
                      }),
                      formatDateShort: formatDateShort,
                      sortByProperty: sortByProperty,
                      latestSaturdate: latestSaturdate
                    })
                  }
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
          PostFitzroy.find({
            $or: [
              { archived: { $exists: false } },
              { archived: false }
            ]
          }, function (err, allPostFitzroys) {
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
                    allTutors: sortByProperty(allTutors, 'name'),
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
          : []
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
                          allTutors: sortByProperty(allTutors, 'name'),
                          allPostFitzroys: sortByProperty(allPostFitzroys, 'name'),
                          allSaturdates: sortByProperty(allSaturdates, 'date', true),
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
    },

    archive: function (req, res) {
      PostFitzroy.findById(req.params.id, function (err, chosenPostFitzroy) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/post-fitzroy/' + req.params.id)
        } else {
          chosenPostFitzroy.archived = req.body.archived
          chosenPostFitzroy.save(function(err) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/postfitzroy/' + req.params.id)
            } else {
              req.flash('success', chosenPostFitzroy.name + '\'s status successfully updated')
              res.redirect('/students/post-fitzroy/' + chosenPostFitzroy.id)
            }
          })
        }
      })
    },

    delete: function (req, res) {
      PostFitzroy.findById(req.params.id, function (err, chosenPostFitzroy) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/post-fitzroy/')
        } else {
          PostFitzroy.update(
            { _id: { $in: chosenPostFitzroy.kidsToAvoid }},
            { $pull: { kidsToAvoid: chosenPostFitzroy.id }},
            { multi: true },
            function (err) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/post-fitzroy/')
              } else {
                Comment.update(
                  { postFitzroys: { $elemMatch: { $eq: chosenPostFitzroy.id }}},
                  { $pull: { postFitzroys: chosenPostFitzroy.id }},
                  { multi: true },
                  function (err) {
                    if (err) {
                      req.flash('error', err.toString())
                      res.redirect('/students/post-fitzroy/')
                    } else {
                      Comment.remove({ postFitzroys: { $exists: true, $eq: [] }}, function (err) {
                        if (err) {
                          req.flash('error', err.toString())
                          res.redirect('/students/post-fitzroy/')
                        } else {
                          PostFitzroy.findByIdAndRemove(chosenPostFitzroy.id, function (err, chosenPostFitzroy) {
                            if (err) {
                              req.flash('error', err.toString())
                              res.redirect('/students/post-fitzroy/')
                            } else {
                              req.flash('success', chosenPostFitzroy.name + ' successfully removed')
                              res.redirect('/students/post-fitzroy/')
                            }
                          })
                        }
                      })
                    }
                  }
                )
              }
            }
          )
        }
      })
    },

    newAttend: function (req, res) {
      PostFitzroy.findById(req.params.id, function (err, chosenPostFitzroy) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/post-fitzroy/')
        } else {
          Saturdate.findOne({
            date: {
              $gt: Date.now() - 64 * 60 * 60 * 1000,
              $lte: Date.now() + 8 * 60 * 60 * 1000
            }
          }, function (err, latestSaturdate) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/post-fitzroy/')
            } else {
              Tutor.find({}, function (err, allTutors) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/post-fitzroy/')
                } else {
                  if (latestSaturdate === null) {
                    req.flash('error', 'There doesn\'t seem to have been a recent session')
                    res.redirect('/students/post-fitzroy/' + chosenPostFitzroy.id)
                  } else if (chosenPostFitzroy.attendance.some(function (indivAtten) {
                    return indivAtten.date.toString() === latestSaturdate.id.toString()
                  })) {
                    req.flash('error', 'Looks like the latest attendance was already created; edit it instead')
                    res.redirect('/students/post-fitzroy/edit/' + chosenPostFitzroy.id)
                  } else {
                    res.render('students/postFitzroy/new-attend', {
                      chosenPostFitzroy: chosenPostFitzroy,
                      latestSaturdate: latestSaturdate,
                      formatDateLong: formatDateLong,
                      allTutors: allTutors
                    })
                  }
                }
              })
            }
          })
        }
      })
    },

    createAttend: function (req, res) {
      var newAttend = {
        date: req.body.date
      }
      if (req.body.tutor !== 'unknown') {
        newAttend.tutor = req.body.tutor
      }
      PostFitzroy.findById(req.params.id, function (err, chosenPostFitzroy) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/post-fitzroy/')
        } else {
          if (chosenPostFitzroy.attendance.some(function (indivAtten) {
            return indivAtten.date.toString() === req.body.date
          })) {
            req.flash('error', 'Looks like the latest attendance was already created; edit it instead')
            res.redirect('/students/post-fitzroy/edit/' + chosenPostFitzroy.id)
          } else {
            PostFitzroy.findByIdAndUpdate(req.params.id, {
              $push: {
                attendance: newAttend
              },
            }, {
              upsert: true
            }, function (err, chosenPostFitzroy) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/post-fitzroy/' + req.params.id)
              } else {
                var newComment = new Comment({
                  date: req.body.date,
                  postFitzroys: [chosenPostFitzroy],
                  contents: req.body.comment
                })
                if (req.body.tutor !== 'unknown') {
                  newComment.tutor = req.body.tutor
                }
                newComment.save(function (err, savedComment) {
                  if (err) {
                    req.flash('error', err.toString())
                    res.redirect('/students/post-fitzroy/' + req.params.id)
                  } else {
                    req.flash('success', 'Latest attendance of ' + chosenPostFitzroy.name + ' added!')
                    res.redirect('/students/post-fitzroy/' + req.params.id)
                  }
                })
              }
            })
          }
        }
      })
    }
  },

  attendance: {

    edit: function (req, res) {
      PreSchool.find({
        $or: [
          { archived: { $exists: false } },
          { archived: false }
        ]
      }, function (err, allPreSchools) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/index')
        } else {
          Fitzroy.find({
            $or: [
              { archived: { $exists: false } },
              { archived: false }
            ]
          }, function (err, allFitzroys) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/index')
            } else {
              PostFitzroy.find({
                $or: [
                  { archived: { $exists: false } },
                  { archived: false }
                ]
              }, function (err, allPostFitzroys) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/index')
                } else {
                  Saturdate.find({}, function (err, allSaturdates) {
                    if (err) {
                      req.flash('error', err.toString())
                      res.redirect('/index')
                    } else {
                      var sortedAllSaturdates = sortByProperty(allSaturdates, 'date')
                      var nextSaturdateIndex = sortedAllSaturdates.findIndex(function (saturdate) {
                        return saturdate.date > Date.now() - 64 * 60 * 60 * 1000
                      })
                      var comingSaturdates = sortedAllSaturdates.slice(nextSaturdateIndex)
                      var comingSaturdate = comingSaturdates[0]
                      res.render('students/attendance', {
                        comingSaturdate: comingSaturdate,
                        formatDateLong: formatDateLong,
                        allPreSchools: sortByProperty(allPreSchools, 'name'),
                        allFitzroys: sortByProperty(allFitzroys, 'name'),
                        allPostFitzroys: sortByProperty(allPostFitzroys, 'name')
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
      var preSchools = filterStudentPrefixedKeys(req.body, 'preSchool')
      var fitzroys = filterStudentPrefixedKeys(req.body, 'fitzroy')
      var postFitzroys = filterStudentPrefixedKeys(req.body, 'postFitzroy')

      var updatePreSchools = new Promise (function (resolve, reject) {
        Object.keys(preSchools).forEach(function (preSchoolId, i) {
          PreSchool.findById(preSchoolId, function (err, chosenPreSchool) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/attendance')
            } else {
              chosenPreSchool.attending = preSchools[preSchoolId]
              chosenPreSchool.save(function(err) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/attendance')
                }
              })
            }
          })
          if (i === Object.keys(preSchools).length - 1) {
            resolve('Attendance updated for all preSchools')
          }
        })
        reject('Error updating attendance for preSchools')
      })
      var updateFitzroys = new Promise (function (resolve, reject) {
        Object.keys(fitzroys).forEach(function (fitzroyId, i) {
          Fitzroy.findById(fitzroyId, function (err, chosenFitzroy) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/attendance')
            } else {
              chosenFitzroy.attending = fitzroys[fitzroyId]
              chosenFitzroy.save(function(err) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/attendance')
                }
              })
            }
          })
          if (i === Object.keys(fitzroys).length - 1) {
            resolve('Attendance updated for all fitzroys')
          }
        })
        reject('Error updating attendance for fitzroys')
      })
      var updatePostFitzroys = new Promise (function (resolve, reject) {
        Object.keys(postFitzroys).forEach(function (postFitzroyId, i) {
          PostFitzroy.findById(postFitzroyId, function (err, postFitzroy) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/attendance')
            } else {
              postFitzroy.attending = postFitzroys[postFitzroyId]
              postFitzroy.save(function(err) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/attendance')
                }
              })
            }
          })
          if (i === Object.keys(postFitzroys).length - 1) {
            resolve('Attendance updated for all postFitzroys')
          }
        })
        reject('Error updating attendance for postFitzroys')
      })

      Promise.all([updatePreSchools, updateFitzroys, updatePostFitzroys])
        .then(function (successResponses) {
          successResponses.forEach(function (successResponse) {
            console.log(successResponse)
          })
          req.flash('success', 'Students\' attendance successfully updated!')
          res.redirect('/students/attendance')
        })
        .catch(function (errorResponses) {
          errorResponses.forEach(function (errorResponse) {
            console.log(errorResponse)
            req.flash('error', errorResponse)
          })
          res.redirect('/students/attendance')
        })
    }
  }

}

module.exports = studentController
