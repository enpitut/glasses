/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    $(document).ready(function () {
        checkLogin();
    });

    function checkLogin() {
        chrome.storage.local.get({
            user_id: null,
            user_name: '',
            user_mail: ''
        }, function (items) {
            if (items.user_id !== null) {
                $('#account_name').text(items.user_name);
                $('#mail_addr').text(items.user_mail);
                setCss(true);
            } else {
                setCss(false);
            }
        });
    }
    ;

    function setCss(flag) {
        if (flag) {
            $('#user_data').css('display', 'block');
            $('#login').css('display', 'none');
        } else {
            $('#user_data').css('display', 'none');
            $('#login').css('display', 'block');
        }
    }

    $('#login_form').submit(function (evt) {
        evt.preventDefault();
        var $form = $(this);
        var $button = $form.find('submit[type=submit]');

        $.ajax({
            url: $form.attr('action'),
            type: $form.attr('method'),
            dataType: 'json',
            data: $form.serialize(),
            beforSend: function (xhr, settings) {
                $button.attr('disabled', true);
            },
            complete: function (xhr, textStatus) {
                $button.attr('disabled', false);
            },
            success: function (result) {
                if (result['id'] !== null) {
                    chrome.storage.local.set({
                        user_name: result['name'],
                        user_mail: result['mail'],
                        user_id: result['id']
                    }, function () {
                        registGCM();
                        alert('ログイン完了');
                        $('#account_name').text(result['name']);
                        $('#mail_addr').text(result['mail']);
                        setCss(true);
                    });
                } else {
                    alert('認証失敗');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('通信失敗');
            }
        });
        return false;
    });

    $('#logout_button').click(function () {
        chrome.storage.local.set({
            user_name: null,
            user_mail: null,
            user_id: null
        }, function () {
            $('#account_name').text('');
            $('#mail_addr').text('');
            setCss(false);
        });
    });

    function registerCallback(registrationId) {
        if (chrome.runtime.lastError) {
            // When the registration fails, handle the error and retry the
            // registration later.
            setInterval(registGCM, 60000);

            return;
        }

        // Send the registration token to your application server.
        sendRegistrationId(function (succeed) {
            // Once the registration token is received by your server,
            // set the flag such that register will not be invoked
            // next time when the app starts up.
            if (succeed)
                chrome.storage.local.set({registered: true});
            else
                alert('GCMへの登録失敗');
        }, registrationId);
    }

    function sendRegistrationId(callback, id) {
        // Send the registration token to your application server
        // in a secure way.
        chrome.storage.local.get('user_id', function (items) {
            $.ajax({
                url: 'http://meganeshibu.sakura.ne.jp/Extension_Script/register.php',
                type: 'post',
                data: {'regId': id, 'userId': items.user_id},
                dataType: 'json',
                success: function () {
                    callback(true);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    callback(false);
                    alert('登録失敗');
                }
            });
        });
    }

    function registGCM() {
        chrome.storage.local.get(['registered'], function (item) {
            // If already registered, bail out.
            console.log("registered:", item.registered);
            if (item.registered)
                return;

            // Up to 100 senders are allowed.
            var senderIds = ["715699645196"];
            alert('register');
            chrome.gcm.register(senderIds, registerCallback);
        });
    }
});

