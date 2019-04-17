Popup = {
    backgroundPageContext: browser.extension.getBackgroundPage().Main,
    elem: document.querySelector('body'),
    init: function(){
        Popup.updateMessageContent();
    },
    updateMessageContent: function(){
        Popup.getMessages().then(function(messages){
            messageHtml = '<ul>';
            Object.keys(messages).forEach(function (key) {
                message = messages[key];
                messageHtml += '<li>' + message.text + '</li>';
            });
            messageHtml += '</ul>';

            Popup.elem.innerHTML = messageHtml;
        });
    },
    getMessages: function(){
        return browser.tabs.query({currentWindow: true, active: true}).then(function(tab){
            tab = tab[0];
            return Popup.backgroundPageContext.messages[tab.id];
        });
    },
};

Popup.init();