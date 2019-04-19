var browser = browser || chrome;

Main = {
    storage: {},
    init: function(){
        browser.runtime.onMessage.addListener(Main.listeners.message);
    },
    notificationCount: {
        update: function(tabId) {
            count = Main.notificationCount.getFromMessageCount(tabId);
            browser.browserAction.setBadgeText({
                text: count.error.toString() > 0 ? count.error.toString() : count.warning.toString(),
                tabId: tabId
            });
            browser.browserAction.setBadgeBackgroundColor({
                'color': (count.error > 0)? 'red' : 'orange',
                tabId: tabId
            });
        },
        getFromMessageCount: function(tabId){
            if(typeof Main.storage[tabId] === 'undefined'){return {warning: {}, error: {}};}
            return {
                warning: Object.keys(Main.storage[tabId]['warning']).length,
                error: Object.keys(Main.storage[tabId]['error']).length,
            };
        },
    },
    listeners: {
        message: function(request, sender, sendResponse) {
            request.storage.forEach(function(message){
                Main.addMessage(sender.tab.id, message.key, message.type, message.text, message.data);
            });
        }
    },
    addMessage: function(tabId, key, type, text, data = []){
        if(typeof Main.storage[tabId] === 'undefined') {
            Main.storage[tabId] = {warning: {}, error: {}};
        }
        Main.storage[tabId][type][key] = {
            type: type,
            text: text,
            data: data,
        };
        Main.notificationCount.update(tabId);
    },
};

Main.init();