cookieFilter = {
    checkedCookies: {},
    init: function(){
        browser.cookies.onChanged.addListener(cookieFilter.listeners.cookieChanged);
        browser.tabs.onUpdated.addListener(cookieFilter.listeners.urlChanged);
    },
    cookie: {
        parse: function(tabId, cookie){
            cookieFilter.cookie.check.all(tabId, cookie);
            cookieFilter.cookie.setChecked(tabId, cookie);
        },
        setChecked: function(tabId, cookie){
            if(typeof cookieFilter.checkedCookies[tabId] === 'undefined') {
                cookieFilter.checkedCookies[tabId] = [];
            }
            if(typeof cookieFilter.checkedCookies[tabId][cookie.domain] === 'undefined') {
                cookieFilter.checkedCookies[tabId][cookie.domain] = [];
            }
            cookieFilter.checkedCookies[tabId][cookie.domain].push(cookie.name);
        },
        parseAllForDomain: function(tabId, domain, reload = false){
            if(domain === '' || (cookieFilter.domain.isChecked(tabId, domain) && !reload)){
                return false;
            }
            console.log('parseAllForDomain triggered for domain: "' + domain + '" with tabid: ' + tabId);
            browser.cookies.getAll({domain: domain}).then((cookies) => {
                if(!cookies.length){
                    return false;
                }
                cookies.forEach(function (cookie) {
                    cookieFilter.cookie.parse(tabId, cookie);
                });
            });
        },
        check: {
            all: function(tabId, cookie){
                cookieFilter.cookie.check.valueExtractable(tabId, cookie);
            },
            valueExtractable: function(tabId, cookie){
                value = cookie.value;
                if(formatConversion.checkContentType.isValidBase64(cookie.value)){
                    value = formatConversion.convert.base64(cookie.value);
                }
                if(formatConversion.checkContentType.isValidJSON(cookie.value)){
                    value = formatConversion.convert.JSON(cookie.value);
                }
                if(value !== cookie.value){
                    Main.addMessage(tabId, 'data-readable-'+ cookie.name, 'warning', 'There is extractable data present in <b>cookie</b> "<i>' + cookie.name + '</i>"', value);
                }
            },
        },
    },
    domain: {
        isChecked: function(tabId, domain){
            if(typeof cookieFilter.checkedCookies[tabId] === 'undefined'){
                return false;
            }
            return (domain in cookieFilter.checkedCookies[tabId] || "." + domain in cookieFilter.checkedCookies[tabId]);
        },
    },
    listeners: {
        cookieChanged: function(changeInfo){
            if(changeInfo.cookie.removed){
                return false;
            }

            browser.tabs.query({currentWindow: true, active: true}).then(function(tab){
                tab = tab[0];
                cookieFilter.cookie.parse(tab.id, changeInfo.cookie);
                console.log('cookiechanged triggered for "' + changeInfo.cookie.name + '" with tabid: ' + tab.id);
            });
        },
        urlChanged: function(tabId, changeInfo, tabinfo) {
            browser.tabs.get(tabId).then(function(tab){
                let newHostName = (new URL(tab.url)).hostname;

                if(typeof cookieFilter.checkedCookies[tabId] === 'undefined' || typeof cookieFilter.checkedCookies[tabId][newHostName] === 'undefined') {
                    cookieFilter.cookie.parseAllForDomain(tabId, newHostName);
                }
            });
        }
    }
};

cookieFilter.init();