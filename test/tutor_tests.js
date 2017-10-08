var expect = require('chai').expect
var should = require('chai').should()
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var request = require('supertest')
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var Tutor = require('../models/tutor')
var faultyTutorAttr = require('./helpers/test_helpers').faultyTutorAttr
var app = require('../index')

chai.use(chaiAsPromised)

// describe('GET /', function () {
//   it('should return a 200 response', function (done) {
//     request(app).get('/')
//     .expect(200, done)
//   })
// })

describe('Tutors', function () {
  describe('1) Creation', function () {
    beforeEach(function (done) {
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
      var tutor = new Tutor(faultyTutorAttr(emptyFields))
      // tutor.validate().should.eventually.be.rejectedWith(Error).notify(done)
      tutor.save().should.eventually.be.rejectedWith(Error).notify(done)
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

      var tutor = new Tutor(faultyTutorAttr(faultyFields))
      // tutor.validate().should.eventually.be.rejectedWith(Error).notify(done)
      tutor.save().should.eventually.be.rejectedWith(Error).notify(done)
    })

    it('Should successfully save tutor if the appropriate params are passed', function (done) {
      var tutor = new Tutor(faultyTutorAttr({}))
      tutor.save().should.eventually.be.fulfilled.notify(done)
    })
    it('Should hash the given password', function (done) {
      var tutor = new Tutor(faultyTutorAttr({}))
      tutor.save().should.eventually.have.property('password').to.not.equal('12345678').notify(done)
    })
    it('Should be able to validate a given password', function (done) {
      var tutor = new Tutor(faultyTutorAttr({}))
      tutor.save().should.eventually.have.property('validPassword').that.is.a('function').notify(done)
    })
    it('Should return false if the wrong password is provided', function (done) {
      var tutor = new Tutor(faultyTutorAttr({}))
      tutor.save(function (err, savedTutor) {
        savedTutor.validPassword('123456789').should.equal(false)
        done()
      })
    })
    it('Should return true if the correct password is provided', function (done) {
      var tutor = new Tutor(faultyTutorAttr({}))
      tutor.save(function (err, savedTutor) {
        savedTutor.validPassword('12345678').should.equal(true)
        done()
      })
    })
  })

  describe('2) Sign up', function () {
    it('Should redirect to sign up page if tutor fails to save')
    it('Should redirect to homepage if tutor is successfully saved')
  })

  describe('3) Log in', function () {
    it('Should redirect to log in page if a wrong password is given')
    it('Should redirect to homepage if the correct password is provided')
  })
})
