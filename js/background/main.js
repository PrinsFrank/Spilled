DataLeakageManager = {
    init: function(){
        browser.runtime.onMessage.addListener(DataLeakageManager.listeners.message);
    },
    count: {
        update: function(length, tabId) {
            browser.browserAction.setBadgeText({
                text: length.toString(),
                tabId: tabId
            });
            browser.browserAction.setBadgeBackgroundColor({
                'color': (length >= 1)? 'red' : 'green',
                tabId: tabId
            });
        },
    },
    listeners: {
        message: function(request, sender, sendResponse) {
            DataLeakageManager.count.update(request.count, sender.tab.id);
        }
    },
};

DataLeakageManager.init();