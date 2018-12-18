//Power by Shotgun
//2017.12.20
//Website:the-x.cn
//引用此js文件，请保留以上信息

if (!Shotgun)
    var Shotgun = {};
if (!Shotgun.Js)
    Shotgun.Js = {};
if (!Shotgun.Js.Charsets)
    Shotgun.Js.Charsets = function () { };

Shotgun.Js.Charsets._writeShortInt = function (bin, si) {
    //Big Endian
    bin.push(si & 0xff);
    bin.push((si >> 8) & 0xff);
}
Shotgun.Js.Charsets._readShortInt = function (bin, offset) {
    //Big Endian
    var c = bin[offset];
    c |= bin[offset + 1] << 8;
    return c;
}
Shotgun.Js.Charsets.toUnicodeBytes = function (str) {
    var bin = [];
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        this._writeShortInt(bin, c);
    }
    return bin;
}
Shotgun.Js.Charsets.fromUnicodeBytes = function (unicodeBytes) {
    var chars = [];
    if (!unicodeBytes || unicodeBytes.length == 0)
        return null;
    for (var i = 0; i < unicodeBytes.length; i += 2) {
        var c = this._readShortInt(unicodeBytes, i);
        chars.push(String.fromCharCode(c));
    }
    return chars.join("");
}
Shotgun.Js.Charsets.toUtf8Bytes = function (str) {
    ///unspport 4byte unicode convert to utf8
    var res = [], len = str.length;
    for (var i = 0; i < len; i++) {
        var code = str.charCodeAt(i);
        if (code <= 0x007F) {
            res.push(code);
        } else if (code <= 0x07FF) {
            var byte1 = 0xC0 | ((code >> 6) & 0x1F);
            var byte2 = 0x80 | (code & 0x3F);
            res.push(byte1, byte2);
        } else if (code <= 0xFFFF) {
            var byte1 = 0xE0 | ((code >> 12) & 0x0F);
            var byte2 = 0x80 | ((code >> 6) & 0x3F);
            var byte3 = 0x80 | (code & 0x3F);
            res.push(byte1, byte2, byte3);
        }
    }
    return res;
}
Shotgun.Js.Charsets.fromUtf8Bytes = function (utf8Bytes) {
    var res = [];
    var i = 0;
    for (var i = 0; i < utf8Bytes.length; i++) {
        var code = utf8Bytes[i];
        if (((code >> 7) & 0xFF) == 0x0) {
            res.push(String.fromCharCode(code));
        } else if (((code >> 5) & 0xFF) == 0x6) {
            var code2 = utf8Bytes[++i];
            var byte1 = (code & 0x1F) << 6;
            var byte2 = code2 & 0x3F;
            res.push(String.fromCharCode(byte1 | byte2));
        } else if (((code >> 4) & 0xFF) == 0xE) {
            var code2 = utf8Bytes[++i];
            var code3 = utf8Bytes[++i];
            var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
            var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
            res.push(String.fromCharCode(((byte1 & 0x00FF) << 8) | byte2));
        } else { res.push(String.fromCharCode(code)); }
    }

    return res.join('');

}

Shotgun.Js.Charsets.toGB2312Bytes = function (str) {
    if (typeof this._unicode2gb == "undefined") {
        console.log("Shotgun.Js.Charsets._unicode2gb undefined!");
        return [];
    }
    var res = [], len = str.length;
    for (var i = 0; i < len; i++) {
        var code = str.charCodeAt(i);
        if (code <= 0x007F) {
            res.push(code);
        } else {
            var gb = this._unicode2gb[code];
            if (typeof gb == "undefined")
                gb = code;
            var arr = [];
            while (gb > 0) {
                arr.push(gb & 0xff);
                gb >>= 8;
            }
            while (arr.length > 0)
                res.push(arr.pop());

        }
    }
    return res;
}

Shotgun.Js.Charsets.fromGB2312Bytes = function (gb2312Bytes) {
    if (typeof this._gb2unicode == "undefined") {
        if (typeof this._unicode2gb == "undefined") {
            console.log("Shotgun.Js.Charsets._unicode2gb undefined!");
            return "";
        }
        this._gb2unicode = [];
        for (var k in this._unicode2gb)
            this._gb2unicode[this._unicode2gb[k]] = parseInt(k);
    }
    var res = [];
    var i = 0;
    for (var i = 0; i < gb2312Bytes.length; i++) {
        var code = gb2312Bytes[i];
        if (code < 0xa1 || code > 0xfe || i + 1 == gb2312Bytes.length) {
            res.push(String.fromCharCode(code));
            continue;
        }
        var c2 = gb2312Bytes[i + 1];
        if (code < 0xa1 || code > 0xfe) {
            res.push(String.fromCharCode(code));
            continue;
        }
        var g = c2 | code << 8;

        c2 = this._gb2unicode[g];
        if (typeof c2 == "undefined") {
            res.push(String.fromCharCode(code));
            continue;
        }
        res.push(String.fromCharCode(c2));
        i++;
    }
    return res.join('');
} 