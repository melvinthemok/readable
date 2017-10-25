document.addEventListener('DOMContentLoaded', function () {
  // checking if required form elements have values
  var required = document.querySelectorAll('.required-group > input, .required-group > select')
  // different listeners for inputs and selects
  var requiredInputs = document.querySelectorAll('.required-group > input')
  var requiredSelects = document.querySelectorAll('.required-group > select')
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

  Array.prototype.forEach.call(requiredInputs, function (elem) {
    elem.oninput = allChecksAndToggleSubmitButton
  })
  
  Array.prototype.forEach.call(requiredSelects, function (elem) {
    elem.onchange = allChecksAndToggleSubmitButton
  })

  generalComment.oninput = allChecksAndToggleSubmitButton
})
