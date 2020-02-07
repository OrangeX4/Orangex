/**
 * @fileOverview 文件替换的主函数库
 * @author <a href="https://github.com/OrangeX4/">OrangeX4</a>
 * @version 0.1
 */
import fs from 'fs';
import * as replacer from './replacer';

interface ResolveFunc < T > {
    (value ? : T | PromiseLike < T > | undefined): void
}
interface RejectFunc {
    (reason ? : any): void
}
interface PromiseFunc < T > {
    (resolve: ResolveFunc < T >, reject: RejectFunc): void
}

/**
 * @description 读取文件
 * @param {string} url URL,即文件的路径
 * @return {Promise <string>} 返回一个Promise
 */
export function readFile(url: string): PromiseFunc < string > {
    return (resolve: ResolveFunc < string >, reject: RejectFunc) => {
        fs.readFile(url, 'utf-8', (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    };
}
/**
 * @description 写入文件
 * @param {string} url URL,即文件的路径
 * @param {string} content 写入的内容
 * @return {Promise <string>} 返回一个Promise
 */
export function writeFile(url: string, content: string): PromiseFunc < void > {
    return (resolve: ResolveFunc < void >, reject: RejectFunc) => {
        fs.writeFile(url, content, (err) => {
            if (err) reject(err);
            else resolve();
        });
    };
}
/**
 * @description 翻译一个文件并写入一个文件内
 * @param {string} preUrl 被翻译的文件的路径
 * @param {string} postUrl 被写入内容的文件的路径
 * @return {Promise <string>} 返回一个Promise
 */
export function translateFileAndSave(preUrl: string,
    postUrl: string,
    dict: replacer.DictMap): Promise < void > {
    return new Promise(readFile(preUrl))
        .then((data) => new Promise(writeFile(postUrl,
            replacer.replaceWithSplit(data, dict).content)));
}
