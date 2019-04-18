formatConversion = {
    checkContentType: {
        isValidBool: function(str){
            return (str === '1' || str === '0' || str === 'true' || str === 'false');
        },
        isValidBase64: function(str){
            if (str ==='' || str.trim() ===''){ return false; }
            try {
                return btoa(atob(str)) == str;
            } catch (err) {
                return false;
            }
        },
        isValidJSON: function(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },
        isValidTimeStamp: function(str) {
            return (new Date(str)) > 0;
        },
        isValidTimeStampWithOutMillis: function(str) {
            return formatConversion.checkContentType.isValidTimeStamp(str * 1000);
        },
        isReadableString: function(str) {
            return /^[A-z0-9]$/.test(str);
        }
    },
    checkByType: {
        string: function(string){
            console.log('string: ' + string);
        },
    },
    convert: {
        base64: function(base64){
            var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

            return Base64.decode(base64);
        },
        timeStamp: function(str){
            return (new Date(str)).toString();
        },
        timeStampWithOutMillis: function(str){
            return formatConversion.convert.timeStamp(str * 1000);
        },
        boolean: function(value){
            return (value === '1' || value === 'true') ? 'true' : false;
        }
    },
    extractRecursively: function(value, depth = 0){
        if(depth >= 10){return value;}depth++; //Check if our totem is spinning
        extractedValue = value; // Make a copy so we can test if this value is changed later

        // The data in these types are resolved so we can return them formatted
        if(formatConversion.checkContentType.isValidBool(value)){return formatConversion.convert.boolean(value);}
        if(formatConversion.checkContentType.isValidTimeStamp(value)){return formatConversion.convert.timeStamp(value);}
        if(formatConversion.checkContentType.isValidTimeStampWithOutMillis(value)){return formatConversion.convert.timeStampWithOutMillis(value);}
        if(formatConversion.checkContentType.isValidJSON(value)){return value;}
        if(formatConversion.checkContentType.isReadableString(value)){return value;}

        // Convert the data
        if(formatConversion.checkContentType.isValidBase64(value)){extractedValue = formatConversion.convert.base64(value);}

        // Check if this step didn't resolve anything so we have our final value
        if(extractedValue === value){return extractedValue;}
        return formatConversion.extractRecursively(extractedValue, depth++);
    }
};