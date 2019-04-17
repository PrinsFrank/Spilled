Main = {
    messages: {},
    init: function(){
        browser.runtime.onMessage.addListener(Main.listeners.message);
    },
    notificationCount: {
        update: function(tabId) {
            count = Main.notificationCount.getFromMessageCount(tabId);
            browser.browserAction.setBadgeText({
                text: count.toString(),
                tabId: tabId
            });
            browser.browserAction.setBadgeBackgroundColor({
                'color': (count >= 1)? 'red' : 'green',
                tabId: tabId
            });
        },
        getFromMessageCount: function(tabId){
            if(typeof Main.messages[tabId] === 'undefined'){
                return 0;
            }
            return Object.keys(Main.messages[tabId]).length;
        }
    },
    listeners: {
        message: function(request, sender, sendResponse) {
            request.messages.forEach(function(message){
                Main.addMessage(sender.tab.id, message.key, message.text, message.data);
            });
        }
    },
    addMessage: function(tabId, key, text, data = []){
        if(typeof Main.messages[tabId] === 'undefined') {
            Main.messages[tabId] = {};
        }
        Main.messages[tabId][key] = {
            text: text,
            data: data,
        };
        Main.notificationCount.update(tabId);
    },
};

Main.init();