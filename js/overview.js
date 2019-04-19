var browser = browser || chrome;

Overview = {
    backgroundPageContext: browser.extension.getBackgroundPage(),
    messageContainer: document.getElementById('message-container'),
    init: function(){
        browser.tabs.query({currentWindow: true, active: true}, function(tab){
            tab = tab[0];
            Overview.updateMessageContent(Overview.backgroundPageContext.Main.getMessagesForTab(tab.id))
        });
    },
    updateMessageContent: function(messages){
        Overview.messageContainer.innerHTML = Overview.backgroundPageContext.generateHTML.list.getFromMessages(messages);
    },
};

Overview.init();