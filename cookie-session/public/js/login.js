$(function () {
    $('#thirdpart').on('click', function () {
        document.location.href = 'http://localhost:3001/OAuth2/authorize?state=HIfhh7wGFk65H&redirect_uri=http://localhost:1002/auth/callback&response_type=code&client_id=4GU8Am5xxN&scope='
    });
    $('#login').on('click', function () {
        var formData = $('form').serialize();
        $.ajax({
            method: 'POST',
            url: './login',
            timeout: 30000,
            data: formData
        }).done(function (result) {
            if (result.errCode === 0) {
                location.href = './home' + location.search;
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
