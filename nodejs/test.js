var replacer = require('./replacer');

function test_native(dict) {
    var str = "jsx js if  ddd  ddd ￥中文 中Eng￥ 1数字-Head $";
    replacer.setSplit("￥");
    // var dict = {"jsx":"爪纹","ddd":"顶顶顶"};
    var returnObject = replacer.replaceWithSplit(str, dict);
    console.log("All:");
    console.log(returnObject);
    console.log("Array content:");
    console.log(returnObject.returnArray[0]);
    
}

function test_web(){

}

var fs = require("fs");
var data = '';

// 创建可读流
var readerStream = fs.createReadStream('./map/dict.json');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
readerStream.on('data', function (chunk) {
    data += chunk;
});

readerStream.on('end', function () {
    // console.log(data);

    dictionary = JSON.parse(data);
    test_native(dictionary.common);
});

readerStream.on('error', function (err) {
    console.log(err.stack);
});

// console.log("程序执行完毕");