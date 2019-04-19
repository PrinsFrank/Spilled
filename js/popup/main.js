var browser = browser || chrome;

Popup = {
    backgroundPageContext: browser.extension.getBackgroundPage().Main,
    messageContainer: document.getElementById('message-container'),
    init: function(){
        Popup.getAllMessages().then(function(messages){
            if(Object.getOwnPropertyNames(messages).length){
                //
            }
            Popup.updateMessageContent(messages);
        });
    },
    updateMessageContent: function(messages){
        messageHtml = '';
        Object.keys(messages).forEach(function (key) {
            message = messages[key];
            messageHtml += '<li id="' + key + '" class="' + message.type + '">' + message.text + '<br><samp>' + message.data + '</samp></li>';
        });

        Popup.messageContainer.innerHTML = messageHtml;
    },
    getMessagesOfType: function(type){
        return browser.tabs.query({currentWindow: true, active: true}).then(function(tab){
            tab = tab[0];
            return Popup.backgroundPageContext.getMessagesForTab(tab.id, type);
        });
    },
    getAllMessages: function(){
        return browser.tabs.query({currentWindow: true, active: true}).then(function(tab){
            let messagesForTab = Popup.backgroundPageContext.getMessagesForTab(tab[0].id);
            return {
                ...messagesForTab['error'],
                ...messagesForTab['warning']
            };
        });
    },
};

Popup.init();