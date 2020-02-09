/**
 * @fileOverview 工具函数库
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */
import * as fs from 'fs';
import nodefetch from 'node-fetch';
import * as jschardet from 'jschardet';
// import util from 'util';


export interface ResolveFunc < T > {
    (value ? : T | PromiseLike < T > | undefined): void
}
export interface RejectFunc {
    (reason ? : any): void
}
export interface PromiseFunc < T > {
    (resolve: ResolveFunc < T >, reject: RejectFunc): void
}
export interface DetectedMap {
    filename: string,
    encoding: string,
    confidence: number
}

/**
 * @description 读取文件
 * @param {string} url URL,即文件的路径
 * @return {Promise <string>} 返回一个Promise
 */
export function readFile(url: string): Promise < string > {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf-8', (err, data) => {
            // console.log('读取文件:-------------------------------------');
            // console.log(data);
            if (err) reject(err);
            resolve(data);
        });
    });
}
/**
 * @description 写入文件
 * @param {string} url URL,即文件的路径
 * @param {string} content 写入的内容
 * @return {Promise <string>} 返回一个Promise
 */
export function writeFile(url: string, content: string): Promise < void > {
    return new Promise((resolve, reject) => {
        fs.writeFile(url, content, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}
/**
 * @description 翻译一个文件并写入一个文件内
 * @param {string} path 被翻译的文件的路径
 * @return {PromiseFunc <DetectedMap[]>} 返回一个PromiseFunc,
 * 可传入new Promise(PromiseFunc).then((data)=>{})中调用,其中data是DetectedMap[]格式的
 */
export function explorer(path:string = 'D:/project/Orangex/nodejs/src'):PromiseFunc <DetectedMap[]> {
    return (resolve: ResolveFunc <DetectedMap[]>, reject: RejectFunc) => {
        const data: DetectedMap[] = [];
        fs.readdir(path, (err, files) => {
            // err 为错误 , files 文件名列表包含文件夹与文件
            if (err) {
                reject(err);
                return;
            }
            Promise.all(files.map((file) => new Promise(((newResolve, newReject) => {
                    fs.stat(`${path}/${file}`, (erro, stat) => {
                        if (erro) {
                            newReject();
                            return;
                        }
                        if (stat.isDirectory()) {
                            // 如果是文件夹遍历
                            // explorer(`${path}/${file}`);
                            new Promise(explorer(`${path}/${file}`)).then((newData) => {
                                data.push(...newData);
                                newResolve();
                            });
                        } else {
                            // 读出所有的文件
                            const str = fs.readFileSync(`${path}/${file}`);
                            const result = jschardet.detect(str);
                            const item: DetectedMap = { filename: `${path}/${file}`, encoding: result.encoding, confidence: result.confidence };

                            // console.log(`编码方式:${result.encoding}; 可信度:${result.confidence}`);
                            // console.log(`文件名:${path}/${file}`);
                            data.push(item);
                            newResolve();
                        }
                    });
                })))).then(() => {
                    resolve(data);
              });
        });
    };
}
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
