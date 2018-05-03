document.addEventListener('DOMContentLoaded', function () {
  // checking if required form elements have values
  var requiredFormGroup = document.querySelector('.required-group')
  var message = document.querySelector('.required-group .form-control-feedback')
  var required = document.querySelectorAll('.required-group input')
  var listeningInputs = document.querySelectorAll('input')
  var submitButton = document.getElementById('submitButton')

  var allChecksAndToggleSubmitButton = function () {
    if (Array.prototype.some.call(required, function (item) {
      return item.checked
    })) {
      requiredFormGroup.classList.remove('list-group-item-warning')
      message.textContent = ''
      submitButton.removeAttribute('disabled')
      submitButton.setAttribute('style', 'cursor:pointer;')
    } else {
      requiredFormGroup.classList.add('list-group-item-warning')
      message.textContent = 'Required'
      submitButton.setAttribute('disabled', true)
      submitButton.removeAttribute('style')
    }
  }

  allChecksAndToggleSubmitButton()

  Array.prototype.forEach.call(listeningInputs, function (elem) {
    elem.addEventListener('input', allChecksAndToggleSubmitButton)
  })
})
