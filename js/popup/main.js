var browser = browser || chrome;

Popup = {
    backgroundPageContext: browser.extension.getBackgroundPage().Main,
    elem: document.getElementById('message-container'),
    init: function(){
        Popup.updateMessageContent();
    },
    updateMessageContent: function(){
        Popup.getAllMessages().then(function(messages){
            messageHtml = '';
            Object.keys(messages).forEach(function (key) {
                message = messages[key];
                messageHtml += '<li id="' + key + '" class="' + message.type + '">' + message.text + '<p>' + message.data + '</p></li>';
            });

            Popup.elem.innerHTML = messageHtml;
        });
    },
    getMessagesOfType: function(type){
        return browser.tabs.query({currentWindow: true, active: true}).then(function(tab){
            tab = tab[0];
            return Popup.backgroundPageContext.storage[tab.id][type];
        });
    },
    getAllMessages: function(){
        return browser.tabs.query({currentWindow: true, active: true}).then(function(tab){
            let messagesForTab = Popup.backgroundPageContext.storage[tab[0].id];
            return {
                ...messagesForTab['error'],
                ...messagesForTab['warning']
            };
        });
    },
};

Popup.init();