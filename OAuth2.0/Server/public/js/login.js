$(function () {
    var formData = $('form').serialize();
    $('#login').on('click', function () {
        $.ajax({
            method: 'POST',
            url: './login',
            timeout: 30000,
            data: formData
        }).done(function (result) {
            console.log(result);
        }).fail(function (xhr, stat, err) {
            if (err === 'timeout') {
                console.log('请求超时，请重试');
            }
        });
    })
});
