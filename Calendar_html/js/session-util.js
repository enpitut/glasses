/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function ($) {
    $.fn.getUserId = function() {
        return $.ajax({
            url: 'sessionManager.php',
            type: 'post',
            data: {'command': 'getUserId'}
        });
    };

    var checkLogin = function () {
        $.ajax({
            url: 'sessionManager.php',
            type: 'post',
            data: {'command': 'checkLogin'},
            success: function (result) {
                if (result) {
                    console.log('You are logined');
                } else {
                    alert('ログインしていません');
                    window.location.href = 'login.html';
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('通信失敗');
                window.location.href = 'login.html';
            }
        });
    };

    $(document).ready(function () {
        checkLogin();
        console.log('checkLogin');
    });
})(jQuery);
