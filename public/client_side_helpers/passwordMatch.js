document.addEventListener('DOMContentLoaded', function () {
  var passwordFormGroup = document.getElementById('password-form-group')
  var password1 = document.getElementById('passwordDraft')
  var password2 = document.getElementById('password')
  var message = document.getElementById('passwordMessage')
  var submitButton = document.getElementById('submitButton')
  password2.onkeyup = function () {
    if (password1.value === password2.value) {
      passwordFormGroup.classList.add('has-success')
      passwordFormGroup.classList.remove('has-warning')
      password1.classList.add('form-control-success')
      password1.classList.remove('form-control-warning')
      password2.classList.add('form-control-success')
      password2.classList.remove('form-control-warning')
      message.textContent = 'Passwords match'
      submitButton.removeAttribute('disabled')
    } else {
      if (!password1.classList.contains('form-control-warning') && !passwordFormGroup.classList.contains('has-warning')) {
        password1.classList.add('form-control-warning')
        passwordFormGroup.classList.add('has-warning')
      }
      if (!password2.classList.contains('form-control-warning') && !passwordFormGroup.classList.contains('has-warning')) {
        password2.classList.add('form-control-warning')
        passwordFormGroup.classList.add('has-warning')
      }
      if (password1.classList.contains('form-control-success') && passwordFormGroup.classList.contains('has-success')) {
        password1.classList.remove('form-control-success')
        passwordFormGroup.classList.remove('has-success')
      }
      if (password2.classList.contains('form-control-success') && passwordFormGroup.classList.contains('has-success')) {
        password2.classList.remove('form-control-success')
        passwordFormGroup.classList.remove('has-success')
      }
      message.textContent = "Passwords don't match"
      submitButton.setAttribute('disabled', true)
    }
  }
})
