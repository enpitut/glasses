/**
 *
 */

$(function () {
    var notificationId = 'notification.id';

    function hideNotification(done) {
        chrome.notifications.clear(notificationId, function () {
            if (done)
                done();
        });
    }
    ;

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
    }
    ;

    chrome.runtime.onStartup.addListener(function () {
        chrome.storage.local.get({
            user_id: null
        }, function (items) {
            if (items.user_id === null) {
                chrome.tabs.create({
                    url: chrome.extension.getURL("option.html")
                });
            }
        });
        //registGCM();
    });

    chrome.gcm.onMessage.addListener(function (message) {
        showNotification(message);
    });

    chrome.browserAction.onClicked.addListener(function () {
        chrome.tabs.create({
            url: chrome.extension.getURL("option.html")
        });
    });
});