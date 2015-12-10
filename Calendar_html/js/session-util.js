/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function ($) {
    // ユーザIDを取得する
    // $(document).getUserId().done(function(id) {
    //  処理内容
    // }).fail(function(id) {
    //  エラー処理
    // });
    //のように記述する
    $.fn.getUserId = function() {
        return $.ajax({
            url: 'sessionManager.php',
            type: 'post',
            data: {'command': 'getUserId'}
        });
    };

    // ログインしているかチェックする
    // ログインしていなければlogin.htmlへ戻す
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
    
    // 初接続か確認する
    // データベースを参照し初接続ならfalse, そうでなければtrueを返す
    // var flag = $(document).checkIntroFlag();
    // と使う
    $.fn.checkIntroFlag = function() {
        var result = $.ajax({
            url: 'sessionManager.php',
            type: 'post',
            async: false,
            data: {'command': 'checkIntro'}
        }).responseText;
        if(result === '0') {
            return true;
        } else {
            return false;
        }
    };

    $(document).ready(function () {
        checkLogin();
    });
})(jQuery);
