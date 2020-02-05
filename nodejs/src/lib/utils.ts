/**
 * @fileOverview 工具函数库
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */
import fs from 'fs';
// import * as nodefetch from 'node-fetch';
import nodefetch from 'node-fetch';


// readWithWebAndRedirect(str => console.log(str));
// exports.readWithWeb = readWithWeb;
// exports.readWithWebAndRedirect = readWithWebAndRedirect;
// exports.downloadWithWeb = downloadWithWeb;
// exports.downloadWithWebAndRedirect = downloadWithWebAndRedirect;
// exports.readWithFile = readWithFile;

// downloadWithWebAndRedirect('./map/dict.json');
/**
 * @description 通过网络下载文件
 * @param {String} path 保存路径
 * @param {String} url 网页地址
 */
export function downloadWithWeb(path: string = './map/dict.json',
    url: string = 'https://api.github.com/repos/Orangex4/Orangex/releases/latest') {
    nodefetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
    }).then((res: any) => res.buffer()).then((_buffer: Buffer) => {
        fs.writeFile(path, _buffer, 'binary', (error:Error | null) => {
        console.log(error);
      });
        // callback(_buffer.toString('utf8'));
    });
}

/**
 * @description 通过网络读取内容
 * @param {Function} callback 回调函数,会传入获取到的内容,形如 callback(buffer);
 * @param {String} url 网页地址
 */
export function readWithWeb(callback: (buf: string) => void,
    url: string = 'https://api.github.com/repos/Orangex4/Orangex/releases/latest') {
    nodefetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
    }).then((res: any) => res.buffer()).then((_buffer: Buffer) => {
        // fs.writeFile(p, _buffer, 'binary', function (err) {
        //     console.log(err || p);
        // });
        callback(_buffer.toString('utf8'));
    });
}
/**
 * @description 通过网络下载Github Release的文件
 * @param {String} path 保存路径
 * @param {String} url Github Release的地址，形如'https://api.github.com/repos/Orangex4/Orangex/releases/latest'
 */
export function downloadWithWebAndRedirect(path: string,
    url: string = 'https://api.github.com/repos/Orangex4/Orangex/releases/latest') {
    readWithWeb((html: string) => {
        const jsonObject = JSON.parse(html);
        const fileUrl = jsonObject.assets[0].browser_download_url;
        // console.log(fileUrl);
        downloadWithWeb(path, fileUrl);
        // let strArray = html.match(/(?<=').*(?=')/);   // (?<=Head：).*(?=Tail)
        // if(strArray.length != 0){
        // console.log(strArray[0]);
        // readWithHttps(callback,strArray[0]);
        // readWithWeb(callback,strArray[0])
        // }
    }, url);
}

/**
 * @description 通过网络读取Github Release的文件
 * @param {Function} callback 回调函数,会传入获取到的内容,形如 callback(buffer);
 * @param {String} url 网页地址，形如'https://api.github.com/repos/Orangex4/Orangex/releases/latest'
 */
export function readWithWebAndRedirect(callback: (buf: string) => void,
    url: string = 'https://api.github.com/repos/Orangex4/Orangex/releases/latest') {
    readWithWeb((html: string) => {
        const jsonObject = JSON.parse(html);
        const fileUrl = jsonObject.assets[0].browser_download_url;
        readWithWeb(callback, fileUrl);
        // let strArray = html.match(/(?<=').*(?=')/);   // (?<=Head：).*(?=Tail)
        // if(strArray.length != 0){
        // console.log(strArray[0]);
        // readWithHttps(callback,strArray[0]);
        // readWithWeb(callback,strArray[0])
        // }
    }, url);
}

/**
 * @description 通过文件读取内容
 * @param {Function} callback 回调函数,会传入获取到的内容,形如 callback(buffer);
 * @param {String} path 文件路径
 */
export function readWithFile(callback: (buf: string) => void,
    path: string = 'D:\\project\\Orangex\\map\\dict.json') {
    let data: string = '';
    // 创建可读流
    const readerStream = fs.createReadStream(path);

    // 设置编码为 utf8。
    readerStream.setEncoding('UTF8');

    // 处理流事件 --> data, end, and error
    readerStream.on('data', (chunk: string) => {
        data += chunk;
    });

    readerStream.on('end', () => {
        // console.log(data);
        callback(data);
    });

    readerStream.on('error', (err: Error) => {
        // eslint-disable-next-line no-console
        console.log(err.stack);
    });
}
