// //node-fetch  https://github.com/bitinn/node-fetch
// var fetch = require("node-fetch");
// var fs = require("fs");

// function download(u, p) {
//     return fetch(url, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/octet-stream' },
//     }).then(res => res.buffer()).then(_buffer => {
//         // fs.writeFile(p, _buffer, "binary", function (err) {
//         //     console.log(err || p);
//         // });
//         console.log(_buffer.toString("utf8"));
//     });
// }
// ////////======= 
// var url = "https://github.com/OrangeX4/Orangex/releases/download/0.0.2/dict.json";
// download(url, url.split("/").reverse()[0])
readWithWebAndRedirect(str => console.log(str));

function readWithWeb(callback,url){
    if (!url) {
        url = "https://api.github.com/repos/Orangex4/Orangex/releases/latest";
    }
    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/octet-stream' },
    }).then(res => res.buffer()).then(_buffer => {
        // fs.writeFile(p, _buffer, "binary", function (err) {
        //     console.log(err || p);
        // });
        callback(_buffer.toString("utf8"));
    });

}

function readWithWebAndRedirect(callback,url){
    if (!url) {
        url = "https://api.github.com/repos/Orangex4/Orangex/releases/latest";
    }
    readWithWeb(function(html){
        var strArray = html.match(/(?<=").*(?=")/);   // (?<=Head：).*(?=Tail)
        if(strArray.length != 0){
            // console.log(strArray[0]);
            // readWithHttps(callback,strArray[0]);
            readWithWeb(callback,strArray[0])
        }
    },url);
}

// function readWithHttps(callback,url) {

//     if (!url) {
//         url = "https://github.com/OrangeX4/Orangex/releases/download/0.0.2/dict.json";
//     }
//     const http = require('https');

//     http.get(url, function (req, res) {
//         let html = '';
//         req.on('data', function (data) {
//             html += data;
//         });
//         req.on('end', function () {
//             // let result = JSON.parse(html);
//             // callback(JSON.parse(html));
//             callback(html);
//         });
//     });
// }


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