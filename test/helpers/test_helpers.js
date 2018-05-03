// attributesToChange must be an object
function createTutorWithFaultyAttr (attributesToChange) {
  var newTutor = {
    email: 'tutor@readable.com',
    name: 'new tutor',
    phone: '81234567',
    gender: 'male',
    age: '26 to 35',
    experience: null,
    startDate: '06/09/2017',
    password: '12345678',
    userType: 'tutor',
    admin: true
  }
  for (var key in attributesToChange) {
    newTutor[key] = attributesToChange[key]
  }

  return newTutor
}

module.exports = {
  createTutorWithFaultyAttr: createTutorWithFaultyAttr
}
