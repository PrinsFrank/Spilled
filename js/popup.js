var browser = browser || chrome;

Popup = {
    backgroundPageContext: browser.extension.getBackgroundPage(),
    messageContainer: document.getElementById('message-container'),
    init: function(){
        browser.tabs.query({currentWindow: true, active: true}, function(tab){
            Popup.getMessagesForTab(tab[0].id)
        });
    },
    getMessagesForTab: function(tabId){
        let messages = Popup.backgroundPageContext.Main.getMessagesForTab(tabId);
        if(Object.getOwnPropertyNames(messages).length === 0){
            browser.tabs.create({
                url: browser.runtime.getURL('/overview.html')
            });return;
        }
        Popup.updateMessageContent(messages);
    },
    updateMessageContent: function(messages){
        Popup.messageContainer.innerHTML = Popup.backgroundPageContext.generateHTML.list.getFromMessages(messages);
    },
};

Popup.init();