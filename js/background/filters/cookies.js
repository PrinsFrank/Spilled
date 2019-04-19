cookieFilter = {
    checkedCookies: {},
    init: function(){
        browser.cookies.onChanged.addListener(cookieFilter.listeners.cookieChanged);
        browser.tabs.onUpdated.addListener(cookieFilter.listeners.tabUpdated);
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
                if(!cookieFilter.cookie.check.valueMeaningfull(tabId, cookie)){
                    cookieFilter.cookie.check.valueExtractable(tabId, cookie);
                }
            },
            valueMeaningfull: function(tabId, cookie){
                if(false !== formatConversion.isMeaningfulData(cookie.value)){
                    Main.addMessage(tabId, 'data-readable-'+ cookie.name, 'warning', 'There is readable data present in <b>cookie</b> "<i>' + cookie.name + '</i>"', formatConversion.isMeaningfulData(cookie.value));
                    return true;
                }
                return false;
            },
            valueExtractable: function(tabId, cookie){
                value = formatConversion.extractRecursively(cookie.value);
                if(value !== cookie.value && false !== formatConversion.isMeaningfulData(value)){
                    Main.addMessage(tabId, 'data-extractable-'+ cookie.name, 'error', 'There is extractable data present in <b>cookie</b> "<i>' + cookie.name + '</i>"', formatConversion.isMeaningfulData(value));
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
        getDomainName: function(domain) {
            // converts www.example.com to example.com but returns example.co.uk
            let regex_var = new RegExp(/([^\.]*\.(([^\.]{0,2}\.[^\.]{0,2})|([^\.]*)))$/g);
            let result = domain.match(regex_var);

            return result[0];
        }
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
        tabUpdated: function(tabId, changeInfo, tabinfo) {
            browser.tabs.get(tabId).then(function(tab){
                let newHostName = (new URL(tab.url)).hostname;
                if(newHostName === ''){return;}
                if(typeof cookieFilter.checkedCookies[tabId] === 'undefined' || typeof cookieFilter.checkedCookies[tabId][newHostName] === 'undefined') {
                    domainName = cookieFilter.domain.getDomainName(newHostName);
                    cookieFilter.cookie.parseAllForDomain(tabId, domainName);
                }
            });
            Main.notificationCount.update(tabId);
        }
    }
};

cookieFilter.init();