/**
 *
 */

$(function () {
    var init = function () {
        chrome.browserAction.setIcon({path: "images/icon/icon_disable.png"});
        chrome.storage.local.set({
            extension: 'off',
            type: 'emphasizeOverlay'
        });
        console.log('initialize');
    };

    chrome.runtime.onInstalled.addListener(init);
    
    chrome.commands.onCommand.addListener(function(command) {
        if((command === 'EmphasisSwitch')||(command === 'ManualFixation')) {
            chrome.runtime.sendMessage({shortcut: command});
        }
    });
});