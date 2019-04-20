var generateHTML = {
  list: {
    getFromMessages: function (messages) {
      let messageHtml = ''
      Object.keys(messages).forEach(function (key) {
        let message = messages[key]
        messageHtml += '<li id="' + key + '" class="' + message.type + '">' + message.text + '<br><samp>' + message.data + '</samp></li>'
      })
      return messageHtml
    }
  }
}
