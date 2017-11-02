$(function () {
    $('#login').on('click', function () {
        var formData = $('form').serialize();
        $.ajax({
            method: 'POST',
            url: './login',
            timeout: 30000,
            data: formData
        }).done(function (result) {
            if (result.errCode === 0) {
                location.href = './authorize' + location.search;
            } else {
                $('.text-danger').text(result.errMsg);
            }
            console.log(result);
        }).fail(function (xhr, stat, err) {
            if (err === 'timeout') {
                console.log('请求超时，请重试');
                $('.text-danger').text('请求超时，请重试');
            }
        });
    })
});
