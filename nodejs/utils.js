var fetch = require("node-fetch");
var fs = require("fs");
// readWithWebAndRedirect(str => console.log(str));
exports.readWithWeb = readWithWeb;
exports.readWithWebAndRedirect = readWithWebAndRedirect;
exports.downloadWithWeb = downloadWithWeb;
exports.downloadWithWebAndRedirect = downloadWithWebAndRedirect;
exports.readWithFile = readWithFile;

// downloadWithWebAndRedirect("./map/dict.json");

function downloadWithWeb(path,url){
    if (!url) {
        url = "https://api.github.com/repos/Orangex4/Orangex/releases/latest";
    }
    if(!path){
        path = "./map/dict.json";
    }
    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/octet-stream' },
    }).then(res => res.buffer()).then(_buffer => {
        fs.writeFile(path, _buffer, "binary", function (err) {
            console.log(err || path);
        });
        // callback(_buffer.toString("utf8"));
    });

}

function downloadWithWebAndRedirect(path,url){
    if (!url) {
        url = "https://api.github.com/repos/Orangex4/Orangex/releases/latest";
    }
    readWithWeb(html => {
        jsonObject = JSON.parse(html);
        fileUrl = jsonObject.assets[0].browser_download_url;
        // console.log(fileUrl);
        downloadWithWeb(path,fileUrl);
        // var strArray = html.match(/(?<=").*(?=")/);   // (?<=Head：).*(?=Tail)
        // if(strArray.length != 0){
            // console.log(strArray[0]);
            // readWithHttps(callback,strArray[0]);
            // readWithWeb(callback,strArray[0])
        // }
    },url);

}

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
    readWithWeb(html => {
        jsonObject = JSON.parse(html);
        fileUrl = jsonObject.assets[0].browser_download_url;
        readWithWeb(callback,fileUrl);
        // var strArray = html.match(/(?<=").*(?=")/);   // (?<=Head：).*(?=Tail)
        // if(strArray.length != 0){
            // console.log(strArray[0]);
            // readWithHttps(callback,strArray[0]);
            // readWithWeb(callback,strArray[0])
        // }
    },url);
}


function readWithFile(callback, url) {
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
}