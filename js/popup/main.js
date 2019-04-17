Popup = {
    backgroundPageContext: browser.extension.getBackgroundPage().Main,
    elem: document.getElementById('message-container'),
    init: function(){
        Popup.updateMessageContent();
    },
    updateMessageContent: function(){
        Popup.getMessages().then(function(messages){
            messageHtml = '';
            Object.keys(messages).forEach(function (key) {
                message = messages[key];
                messageHtml += '<li id="' + key + '" class="' + message.type + '">' + message.text + '<p>' + message.data + '</p></li>';
            });

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