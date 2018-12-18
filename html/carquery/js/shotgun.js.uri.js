//Power by Shotgun
//2017.12.23
//Website:the-x.cn
//引用此js文件，请保留以上信息

//实现类似 decodeURIComponent/encodeURIComponent 功能的URL编码

if (!Shotgun)
    var Shotgun = {};
if (!Shotgun.Js)
    Shotgun.Js = {};
if (!Shotgun.Js.Uri)
    Shotgun.Js.Uri = {};
//URLEncode 与编无关，传入byte[]
Shotgun.Js.Uri.encode = function (bin) {
    var rlt = [];
    for (var i = 0; i < bin.length; i++) {
        var b = bin[i];
        var c = false;
        c |= b >= 48 && b <= 57;
        c |= b >= 65 && b <= 90;
        c |= b >= 97 && b <= 122;
        c |= b == 0x5f || b == 0x2e || b == 0x2d;
        if (c)
            rlt.push(String.fromCharCode(b));
        else {
            rlt.push(b < 16 ? "%0" : "%");
            rlt.push(b.toString(16).toUpperCase());
        }
    }
    return rlt.join("");
}
//URLDecode 与编码无关，返回伪byte[]
Shotgun.Js.Uri.decode = function (str) {
    var bin = [];
    var len = str.length;
    for (var i = 0; i < len; i++) {
        var c = str.charCodeAt(i);
        if (c == 0x2b) {//+
            bin.push(32);
            continue;
        }
        var iUncoder = c != 0x25;//%
        iUncoder |= i + 2 >= len;
        var c1, c2;
        if (!iUncoder) {
            c1 = str.charCodeAt(i + 1);
            c2 = str.charCodeAt(i + 2);
            iUncoder |= !(c1 >= 48 && c1 <= 57 || c1 >= 65 && c1 <= 70 || c1 >= 97 && c1 <= 102);//0-9 A-F a-f
            iUncoder |= !(c2 >= 48 && c2 <= 57 || c2 >= 65 && c2 <= 70 || c2 >= 97 && c2 <= 102);
        }

        if (iUncoder) {
            bin.push(c);
            continue;
        }

        if (c1 <= 57)
            c1 -= 48;
        else if (c1 > 90)
            c1 -= 97 - 10;
        else
            c1 -= 65 - 10;

        if (c2 <= 57)
            c2 -= 48;
        else if (c2 > 90)
            c2 -= 97 - 10;
        else
            c2 -= 65 - 10;
        bin.push(c2 | c1 << 4);
        i += 2;
    }

    return bin;

}