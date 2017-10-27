document.addEventListener('DOMContentLoaded', function () {
  var generalCommentFormGroup = document.getElementById('general-comment-form-group')
  var generalComment = document.getElementById('generalComment')
  var message = document.getElementById('generalCommentMessage')
  generalComment.onkeyup = function() {
    if (generalComment.value.length < 501) {
      if (generalComment.classList.contains('form-control-warning') && generalCommentFormGroup.classList.contains('has-warning')) {
        generalComment.classList.remove('form-control-warning')
        generalCommentFormGroup.classList.remove('has-warning')
      }
      if (!generalComment.classList.contains('form-control-success') && !generalCommentFormGroup.classList.contains('has-success')) {
        generalComment.classList.add('form-control-success')
        generalCommentFormGroup.classList.add('has-success')
      }
      message.textContent = 'Characters remaining: ' + (500 - generalComment.value.length)
    } else {
      if (generalComment.classList.contains('form-control-success') && generalCommentFormGroup.classList.contains('has-success')) {
        generalComment.classList.remove('form-control-success')
        generalCommentFormGroup.classList.remove('has-success')
      }
      if (!generalComment.classList.contains('form-control-warning') && !generalCommentFormGroup.classList.contains('has-warning')) {
        generalComment.classList.add('form-control-warning')
        generalCommentFormGroup.classList.add('has-warning')
      }
      message.textContent = 'Too much information'
    }
  }
})
