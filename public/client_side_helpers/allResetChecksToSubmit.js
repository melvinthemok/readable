document.addEventListener('DOMContentLoaded', function () {
  // checking if required form elements have values
  var required = document.querySelectorAll('.required-group > input')
  var listeningInputs = document.querySelectorAll('.required-group > input')
  // enable submit only if other client-side helper checks succeed
  var password1 = document.getElementById('passwordDraft')
  var password2 = document.getElementById('password')
  var submitButton = document.getElementById('submitButton')

  var allChecksAndToggleSubmitButton = function () {
    if (!Array.prototype.some.call(required, function (item) {
      return item.value === ''
    }) && password1.value.length > 7 && password1.value.length < 31 && password1.value === password2.value) {
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
})
