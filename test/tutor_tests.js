var should = require('chai').should()
var chai = require('chai')
var request = require('supertest')
var mongoose = require('mongoose')
var Tutor = require('../models/tutor')
var createTutorWithFaultyAttr = require('./helpers/test_helpers').createTutorWithFaultyAttr
var app = require('../index')

describe('Tutors', function () {
  describe('1) Creation', function () {
    beforeEach(function (done) {
      mongoose.connection.collections.tutors.drop(function () {
        done()
      })
    })

    afterEach(function (done) {
      mongoose.connection.collections.tutors.drop(function () {
        done()
      })
    })

    it('Should fail to save tutor if required params are not present', function (done) {
      var emptyFields = {
        email: '',
        phone: '',
        gender: '',
        age: '',
        startDate: '',
        password: ''
      }

      var tutor = new Tutor(createTutorWithFaultyAttr(emptyFields))
      tutor.save(function (err, data) {
        err.should.be.an.instanceof(Error)
        done()
      })
    })

    it('Should fail to save tutor if custom validation is not met', function (done) {
      var faultyFields = {
        name: 'a',
        email: 'email',
        phone: 'phonenumber',
        gender: 'inbetween',
        age: '0',
        startDate: '8 october 2017',
        password: '123'
      }

      var tutor = new Tutor(createTutorWithFaultyAttr(faultyFields))
      tutor.save(function (err, data) {
        err.should.be.an.instanceof(Error)
        done()
      })
    })

    it('Should successfully save tutor if the appropriate params are passed', function (done) {
      var tutor = new Tutor(createTutorWithFaultyAttr({}))
      tutor.save(function (err, savedTutor) {
        savedTutor.should.be.an.instanceof(Tutor)
        done()
      })
    })

    it('Should hash the given password', function (done) {
      var tutor = new Tutor(createTutorWithFaultyAttr({}))
      tutor.save(function (err, savedTutor) {
        savedTutor.should.have.property('password').to.not.equal('12345678')
        done()
      })
    })

    it('Should be able to validate a given password', function (done) {
      var tutor = new Tutor(createTutorWithFaultyAttr({}))
      tutor.save(function (err, savedTutor) {
        savedTutor.should.have.property('validPassword').that.is.a('function')
        done()
      })
    })

    it('Should return false if the wrong password is provided', function (done) {
      var tutor = new Tutor(createTutorWithFaultyAttr({}))
      tutor.save(function (err, savedTutor) {
        savedTutor.validPassword('123456789').should.equal(false)
        done()
      })
    })

    it('Should return true if the correct password is provided', function (done) {
      var tutor = new Tutor(createTutorWithFaultyAttr({}))
      tutor.save(function (err, savedTutor) {
        savedTutor.validPassword('12345678').should.equal(true)
        done()
      })
    })
  })

  describe('2) Sign up', function () {
    beforeEach(function (done) {
      mongoose.connection.collections.tutors.drop(function () {
        done()
      })
    })

    after(function (done) {
      mongoose.connection.collections.tutors.drop(function () {
        done()
      })
    })

    it('Should redirect to sign up page if an invalid field is given', function (done) {
      var signUpPassword = process.env.SIGNUP_PASSWORD
      request(app).post('/auth/tutor/signup')
                  .set('Accept', 'application/json')
                  .type('form')
                  .send(Object.assign(
                    createTutorWithFaultyAttr({ email: '' }),
                    { tutorSignUpAttempt: signUpPassword })
                  )
                  .expect('Location', '/auth/tutor/signup')
                  .end(done)
    })

    it('Should redirect to sign up page if an incorrect signup passphrase is given', function (done) {
      request(app).post('/auth/tutor/signup')
                  .set('Accept', 'application/json')
                  .type('form')
                  .send(Object.assign(
                    createTutorWithFaultyAttr({}),
                    { tutorSignUpAttempt: 'wrongpassphrase' })
                  )
                  .expect('Location', '/auth/tutor/signup')
                  .end(done)
    })

    it('Should redirect to attendance page if tutor is successfully saved', function (done) {
      var signUpPassword = process.env.SIGNUP_PASSWORD
      request(app).post('/auth/tutor/signup')
                  .set('Accept', 'application/json')
                  .type('form')
                  .send(Object.assign(
                    createTutorWithFaultyAttr({}),
                    { tutorSignUpAttempt: signUpPassword })
                  )
                  .expect('Location', /^\/tutors\/attendance\/[0-9a-f]{24}$/)
                  .end(function () {
                    Tutor.findOne({ 'email': 'tutor@readable.com' }, function (err, savedTutor) {
                      savedTutor.should.be.an.instanceof(Tutor)
                      done()
                    })
                  })
    })
  })

  describe('3) Log in', function () {
    before(function (done) {
      var tutor = new Tutor(createTutorWithFaultyAttr({}))
      tutor.save(function (err, res) {
        done()
      })
    })

    after(function (done) {
      mongoose.connection.collections.tutors.drop(function () {
        done()
      })
    })

    it('Should redirect to log in page if a wrong email is given', function (done) {
      request(app).post('/auth/tutor/login')
                  .set('Accept', 'application/json')
                  .type('form')
                  .send({
                    email: 'wrongemail@readable.com',
                    password: '12345678'
                  })
                  .expect('Location', '/auth/tutor/login')
                  .end(done)
    })

    it('Should redirect to log in page if a wrong password is given', function (done) {
      request(app).post('/auth/tutor/login')
                  .set('Accept', 'application/json')
                  .type('form')
                  .send({
                    email: 'tutor@readable.com',
                    password: '123456789'
                  })
                  .expect('Location', '/auth/tutor/login')
                  .end(done)
    })

    it('Should redirect to students page if the correct email and password are provided', function (done) {
      Tutor.findOne({ 'email': 'tutor@readable.com' }, function (err, tutor) {
        tutor.should.be.an.instanceof(Tutor)
        request(app).post('/auth/tutor/login')
          .set('Accept', 'application/json')
          .type('form')
          .send({
            email: 'tutor@readable.com',
            password: '12345678'
          })
          .expect('Location', '/students')
          .end(done)
      })
    })
  })
})
