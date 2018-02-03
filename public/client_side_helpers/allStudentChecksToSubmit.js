document.addEventListener('DOMContentLoaded', function () {
  // checking if required form elements have values
  var required = document.querySelectorAll('.required-group > input, .required-group > select')
  // different listeners for inputs and selects
  var listeningInputs = document.querySelectorAll('.required-group > input, #generalComment')
  var listeningSelects = document.querySelectorAll('.required-group > select')
  // enable submit only if other client-side helper checks succeed
  var name = document.getElementById('name')
  var generalComment = document.getElementById('generalComment')
  var submitButton = document.getElementById('submitButton')

  var allChecksAndToggleSubmitButton = function () {
    if (!Array.prototype.some.call(required, function (item) {
      return item.value === ''
    }) && name.value.length > 2 && name.value.length < 41 && generalComment.value.length < 501) {
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
