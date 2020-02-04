/**
* @fileOverview 工具函数库
* @author <a href="https://github.com/OrangeX4/">OrangeX4</a>
* @version 0.1
*/

var fetch = require("node-fetch");
var fs = require("fs");
// readWithWebAndRedirect(str => console.log(str));
exports.readWithWeb = readWithWeb;
exports.readWithWebAndRedirect = readWithWebAndRedirect;
exports.downloadWithWeb = downloadWithWeb;
exports.downloadWithWebAndRedirect = downloadWithWebAndRedirect;
exports.readWithFile = readWithFile;

// downloadWithWebAndRedirect("./map/dict.json");
/**
* @description 通过网络下载文件
* @param {String} path 保存路径
* @param {String} url 网页地址
*/
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

/**
* @description 通过网络下载Github Release的文件
* @param {String} path 保存路径
* @param {String} url Github Release的地址，形如"https://api.github.com/repos/Orangex4/Orangex/releases/latest"
*/
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
/**
* @description 通过网络读取内容
* @param {Function} callback 回调函数,会传入获取到的内容,形如 callback(buffer);
* @param {String} url 网页地址
*/
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

/**
* @description 通过网络读取Github Release的文件
* @param {Function} callback 回调函数,会传入获取到的内容,形如 callback(buffer);
* @param {String} url 网页地址，形如"https://api.github.com/repos/Orangex4/Orangex/releases/latest"
*/
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

/**
* @description 通过文件读取内容
* @param {Function} callback 回调函数,会传入获取到的内容,形如 callback(buffer);
* @param {String} path 文件路径
*/
function readWithFile(callback, path) {
    var data = '';

    if (!path) {
        path = "./map/dict.json";
    }
    // 创建可读流
    var readerStream = fs.createReadStream(path);

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