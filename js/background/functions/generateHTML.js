generateHTML = {
    list: {
        getFromMessages: function (messages) {
            messageHtml = '';
            Object.keys(messages).forEach(function (key) {
                message = messages[key];
                messageHtml += '<li id="' + key + '" class="' + message.type + '">' + message.text + '<br><samp>' + message.data + '</samp></li>';
            });
            return messageHtml;
        }
    }
};