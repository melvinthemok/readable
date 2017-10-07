document.addEventListener('DOMContentLoaded', function () {
  var experienceFormGroup = document.getElementById('experience-form-group')
  var experience = document.getElementById('experience')
  var message = document.getElementById('experienceMessage')
  experience.onkeyup = function() {
    if (experience.value.length < 501) {
      if (experience.classList.contains('form-control-warning') && experienceFormGroup.classList.contains('form-control-warning')) {
        experience.classList.remove('form-control-warning')
        experienceFormGroup.classList.remove('has-warning')
      }
      if (!experience.classList.contains('form-control-success') && !experienceFormGroup.classList.contains('form-control-success')) {
        experience.classList.add('form-control-success')
        experienceFormGroup.classList.add('has-success')
      }
      message.textContent = 'Characters remaining: ' + (500 - experience.value.length)
    } else {
      if (experience.classList.contains('form-control-success') && experienceFormGroup.classList.contains('form-control-success')) {
        experience.classList.remove('form-control-success')
        experienceFormGroup.classList.remove('has-success')
      }
      if (!experience.classList.contains('form-control-warning') && !experienceFormGroup.classList.contains('form-control-warning')) {
        experience.classList.add('form-control-warning')
        experienceFormGroup.classList.add('has-warning')
      }
      message.textContent = 'Too much information'
    }
  }
})
