Popup = {
    backgroundPageContext: browser.extension.getBackgroundPage().Main,
    elem: document.querySelector('body'),
    messages: [],
    init: function(){
        Popup.updateMessageContent();
    },
    updateMessageContent: function(){
        messageHtml = '<ul>';
        Popup.backgroundPageContext.messages.forEach(function(message){
            console.log(message);
            messageHtml += '<li>' + message.text + '</li>';
        });
        messageHtml += '</ul>';

        Popup.elem.innerHTML = messageHtml;
    },
};

Popup.init();