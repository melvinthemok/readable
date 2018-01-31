document.addEventListener('DOMContentLoaded', function () {
  // checking if required form elements have values
  var required = document.querySelectorAll('.required-group > input, .required-group > select')
  // different listeners for inputs and selects
  var listeningInputs = document.querySelectorAll('.required-group > input, #experience')
  var listeningSelects = document.querySelectorAll('.required-group > select')
  // enable submit only if other client-side helper checks succeed
  var email = document.getElementById('email')
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  var name = document.getElementById('name')
  var phone = document.getElementById('phone')
  var phoneRegex = /^[6, 8, 9]\d{7}$/
  var experience = document.getElementById('experience')
  var password1 = document.getElementById('passwordDraft')
  var password2 = document.getElementById('password')
  var submitButton = document.getElementById('submitButton')

  var allChecksAndToggleSubmitButton = function () {
    if (!Array.prototype.some.call(required, function (item) {
      return item.value === ''
    }) && emailRegex.test(email.value) && name.value.length > 2 && name.value.length < 41 && phoneRegex.test(phone.value) && (!experience || experience.value.length < 501) && password1.value.length > 7 && password1.value.length < 31 && password1.value === password2.value) {
      submitButton.removeAttribute('disabled')
      submitButton.setAttribute('style', 'cursor:pointer;')
    } else {
      submitButton.setAttribute('disabled', true)
      submitButton.removeAttribute('style')
    }
  }

  Array.prototype.forEach.call(listeningInputs, function (elem) {
    elem.addEventListener('input', allChecksAndToggleSubmitButton)
  })
  
  Array.prototype.forEach.call(listeningSelects, function (elem) {
    elem.addEventListener('change', allChecksAndToggleSubmitButton)
  })
})
