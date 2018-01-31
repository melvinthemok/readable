document.addEventListener('DOMContentLoaded', function () {
  var passwordFormGroup = document.getElementById('password-form-group')
  var password1 = document.getElementById('passwordDraft')
  var password2 = document.getElementById('password')
  var message = document.getElementById('passwordMessage')
  password2.addEventListener('input', function () {
    if (password1.value === password2.value && password1.value !== '' && password2.value !== '') {
      passwordFormGroup.classList.add('has-success')
      password1.classList.add('form-control-success')
      password2.classList.add('form-control-success')
      passwordFormGroup.classList.remove('has-warning')
      password1.classList.remove('form-control-warning')
      password2.classList.remove('form-control-warning')
      message.textContent = 'Passwords match'
    } else {
      passwordFormGroup.classList.add('has-warning')
      password1.classList.add('form-control-warning')
      password2.classList.add('form-control-warning')
      passwordFormGroup.classList.remove('has-success')
      password1.classList.remove('form-control-success')
      password2.classList.remove('form-control-success')
      message.textContent = 'Passwords don\'t match'
    }
  })
})
