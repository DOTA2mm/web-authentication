$(function () {
  $('#confirm').on('click', function () {
      $('form').submit();
    //   var formData = location.search.substr(1);
    //   $.ajax({
    //       method: 'POST',
    //       url: './authorize',
    //       timeout: 30000,
    //       data: formData
    //   }).done(function (result) {
    //       if (result.errCode === 0) {
    //           location.href = './authorize' + location.search;
    //       } else {
    //           $('.text-danger').text(result.errMsg);
    //       }
    //       console.log(result);
    //   }).fail(function (xhr, stat, err) {
    //       if (err === 'timeout') {
    //           console.log('请求超时，请重试');
    //       }
    //   });
  })
});
