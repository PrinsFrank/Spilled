var Main = {
  storage: {},
  init: function () {
    browser.runtime.onMessage.addListener(Main.listeners.message)
    browser.tabs.onUpdated.addListener(Main.listeners.tabUpdated)
  },
  notificationCount: {
    update: function (tabId) {
      let count = Main.notificationCount.getFromMessageCount(tabId)
      browser.browserAction.setBadgeText({
        text: Main.notificationCount.getText(count),
        tabId: tabId
      })
      browser.browserAction.setBadgeBackgroundColor({
        color: Main.notificationCount.getColor(count),
        tabId: tabId
      })
    },
    getText: function (count) {
      if (count.error <= 0 && count.warning <= 0) { return '' }
      if (count.error <= 0) { return count.warning.toString() }
      return count.warning > 0 ? count.error.toString() + '+' : count.error.toString()
    },
    getColor: function (count) {
      if (count.error <= 0 && count.warning <= 0) {
        return '#20FDC3'
      }
      return (count.error > 0) ? '#E03C37' : '#EBE13D'
    },
    getFromMessageCount: function (tabId) {
      if (typeof Main.storage[tabId] === 'undefined') { return { warning: 0, error: 0 } }
      return {
        warning: Object.keys(Main.storage[tabId]['warning']).length,
        error: Object.keys(Main.storage[tabId]['error']).length
      }
    }
  },
  listeners: {
    message: function (request, sender, sendResponse) {
      request.storage.forEach(function (message) {
        Main.addMessage(sender.tab.id, message.key, message.type, message.text, message.data)
      })
    },
    tabUpdated: function (tabId, changeInfo, tabinfo) {
      browser.tabs.get(tabId, function (tab) {
        if (tab.url.startsWith('moz-extension://')) {
          browser.browserAction.disable(tab.id)
        }
      })
    }
  },
  addMessage: function (tabId, key, type, text, data = []) {
    if (typeof Main.storage[tabId] === 'undefined') { Main.storage[tabId] = { warning: {}, error: {} } }
    Main.storage[tabId][type][key] = {
      type: type,
      text: text,
      data: data
    }
    Main.notificationCount.update(tabId)
  },
  getMessagesForTab: function (tabId, type = null) {
    if (typeof Main.storage[tabId] === 'undefined') { Main.storage[tabId] = { warning: {}, error: {} } }
    if (type !== null) {
      return Main.storage[tabId][type]
    }
    return {
      ...Main.storage[tabId]['error'],
      ...Main.storage[tabId]['warning']
    }
  }
}

Main.init()
