document.addEventListener('DOMContentLoaded', function () {
  var nameFormGroup = document.getElementById('name-form-group')
  var name = document.getElementById('name')
  var message = document.getElementById('nameLengthMessage')
  var submitButton = document.getElementById('submitButton')
  name.onkeyup = function () {
    if (name.value.length > 2 && name.value.length < 41) {
      nameFormGroup.classList.add('has-success')
      nameFormGroup.classList.remove('has-warning')
      name.classList.add('form-control-success')
      name.classList.remove('form-control-warning')
      message.textContent = ''
      submitButton.removeAttribute('disabled')
    } else if (name.value.length < 3) {
      if (!name.classList.contains('form-control-warning') && !nameFormGroup.classList.contains('has-warning')) {
        name.classList.add('form-control-warning')
        nameFormGroup.classList.add('has-warning')
      }
      if (name.classList.contains('form-control-success') && nameFormGroup.classList.contains('has-success')) {
        name.classList.remove('form-control-success')
        nameFormGroup.classList.remove('has-success')
      }
      message.textContent = 'Too short'
      submitButton.setAttribute('disabled', true)
    } else {
      if (!name.classList.contains('form-control-warning') && !nameFormGroup.classList.contains('has-warning')) {
        name.classList.add('form-control-warning')
        nameFormGroup.classList.add('has-warning')
      }
      if (name.classList.contains('form-control-success') && nameFormGroup.classList.contains('has-success')) {
        name.classList.remove('form-control-success')
        nameFormGroup.classList.remove('has-success')
      }
      message.textContent = 'Too long'
      submitButton.setAttribute('disabled', true)
    }
  }
})
