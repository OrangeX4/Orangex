var replacer = require('./replacer');
var str = "jsx js if  ddd  ddd ￥中文 中Eng￥ 1数字-Head $";
readWithHttpsAndRedirect(testFunc);

function testFunc(dict) {
    console.log(dict);
    replacer.setSplit("￥");
    // var dict = {"jsx":"爪纹","ddd":"顶顶顶"};
    var returnObject = replacer.replaceWithSplit(str, JSON.parse(dict).common);
    console.log("All:");
    console.log(returnObject);
    console.log("Array content:");
    console.log(returnObject.returnArray[0]);

}
function readWithHttpsAndRedirect(callback,url){
    readWithHttps(function(html){
        var strArray = html.match(/(?<=").*(?=")/);   // (?<=Head：).*(?=Tail)
        if(strArray.length != 0){
            console.log(strArray[0]);
            readWithHttps(callback,strArray[0]);
        }
    });
}
function readWithHttps(callback,url) {

    if (!url) {
        url = "https://github.com/OrangeX4/Orangex/releases/download/0.0.2/dict.json";
    }
    const http = require('https');

    http.get(url, function (req, res) {
        let html = '';
        req.on('data', function (data) {
            html += data;
        });
        req.on('end', function () {
            // let result = JSON.parse(html);
            // callback(JSON.parse(html));
            callback(html);
        });
    });
}


function readWithFile(callback, url) {
    var fs = require("fs");
    var data = '';

    if (!url) {
        url = "./map/dict.json";
    }
    // 创建可读流
    var readerStream = fs.createReadStream(url);

    // 设置编码为 utf8。
    readerStream.setEncoding('UTF8');

    // 处理流事件 --> data, end, and error
    readerStream.on('data', function (chunk) {
        data += chunk;
    });

    readerStream.on('end', function () {
        // console.log(data);
        callback(data);
    });

    readerStream.on('error', function (err) {
        console.log(err.stack);
    });

    // console.log("程序执行完毕");
}