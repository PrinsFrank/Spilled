DataLeakageClient = {
    init: function(){
        browser.runtime.sendMessage({
            "count": 10
        });
    },
};

DataLeakageClient.init();