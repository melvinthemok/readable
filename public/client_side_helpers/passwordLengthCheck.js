document.addEventListener('DOMContentLoaded', function () {
  var passwordFormGroup = document.getElementById('password-form-group')
  var password1 = document.getElementById('passwordDraft')
  var message = document.getElementById('passwordMessage')
  var submitButton = document.getElementById('submitButton')
  password1.onkeyup = function () {
    if (password1.value.length > 7 && password1.value.length < 31) {
      passwordFormGroup.classList.remove('has-warning')
      password1.classList.remove('form-control-warning')
      message.textContent = ''
    } else if (password1.value.length < 8) {
      if (!password1.classList.contains('form-control-warning') && !passwordFormGroup.classList.contains('has-warning')) {
        password1.classList.add('form-control-warning')
        passwordFormGroup.classList.add('has-warning')
      }
      message.textContent = 'Too short'
      submitButton.setAttribute('disabled', true)
    } else {
      if (!password1.classList.contains('form-control-warning') && !passwordFormGroup.classList.contains('has-warning')) {
        password1.classList.add('form-control-warning')
        passwordFormGroup.classList.add('has-warning')
      }
      message.textContent = 'Too long'
      submitButton.setAttribute('disabled', true)
    }
  }
})
