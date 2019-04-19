var browser = browser || chrome;

Popup = {
    backgroundPageContext: browser.extension.getBackgroundPage(),
    messageContainer: document.getElementById('message-container'),
    init: function(){
        Popup.getMessagesForCurrentTab().then(function(messages){
            if(Object.getOwnPropertyNames(messages).length === 0){
                browser.tabs.create({
                    url: browser.runtime.getURL('/overview.html')
                });return;
            }
            Popup.updateMessageContent(messages);
        });
    },
    updateMessageContent: function(messages){
        Popup.messageContainer.innerHTML = Popup.backgroundPageContext.generateHTML.list.getFromMessages(messages);
    },
    getMessagesForCurrentTab: function(){
        return browser.tabs.query({currentWindow: true, active: true}).then(function(tab){
            return Popup.backgroundPageContext.Main.getMessagesForTab(tab[0].id);
        });
    },
};

Popup.init();