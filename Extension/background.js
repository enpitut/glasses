/**
 *
 */

$(function () {
    var notificationId = 'notification.id';

    function hideNotification(done) {
        chrome.notifications.clear(notificationId, function () {
            if (done) done();
        });
    };

    function showNotification(message) {
        var text = message === null ? 'Receive Taskru Notifications' : message.data.message;
        hideNotification(function () {
            chrome.notifications.create(notificationId, {
                iconUrl: chrome.runtime.getURL('images/taskru_logo.png'),
                title: 'Taskru Notification',
                type: 'basic',
                message: text
            }, function () {
            });
        });
    };

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
        }, registrationId);
    }

    function sendRegistrationId(callback, id) {
        // Send the registration token to your application server
        // in a secure way.
        var type = id;
        $.ajax({
            url: 'register.php',
            type: 'post',
            data: {'regId': id},
            dataType: 'json',
            success:function() {
                callback(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                callback(false);
                alert('登録失敗');
            }
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
    
    chrome.runtime.onStartup.addListener(function () {
        registGCM();
    });
    
    chrome.gcm.onMessage.addListener(function(message) {
        showNotification(message);
    });

    chrome.browserAction.onClicked.addListener(registGCM);
});