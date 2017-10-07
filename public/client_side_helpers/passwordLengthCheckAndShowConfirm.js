document.addEventListener('DOMContentLoaded', function () {
  var password1 = document.getElementById('passwordDraft')
  // show password confirmation only onkeyup in passwordDraft
  var description = document.getElementById('passwordDescription')
  var password2 = document.getElementById('password')
  // show alert if passwordDraft too short or too long
  var passwordFormGroup = document.getElementById('password-form-group')
  var message = document.getElementById('passwordMessage')
  password1.onkeyup = function () {
    if (description.hasAttribute('style')) {
      description.removeAttribute('style')
    }
    if (password2.hasAttribute('style')) {
      password2.removeAttribute('style')
    }
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
    } else {
      if (!password1.classList.contains('form-control-warning') && !passwordFormGroup.classList.contains('has-warning')) {
        password1.classList.add('form-control-warning')
        passwordFormGroup.classList.add('has-warning')
      }
      message.textContent = 'Too long'
    }
  }
})
