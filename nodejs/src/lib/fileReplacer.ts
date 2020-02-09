/**
 * @fileOverview 文件替换的主函数库
 * @author <a href="https://github.com/OrangeX4/">OrangeX4</a>
 * @version 0.1
 */
import * as Path from 'path';
import * as replacer from './replacer';
import * as utils from './utils';

/**
 * @description 翻译一个文件并写入一个文件内
 * @param {string} preUrl 被翻译的文件的路径
 * @param {string} postUrl 被写入内容的文件的路径
 * @return {Promise <string>} 返回一个Promise
 */
export function translateFile(preUrl: string,
    postUrl: string,
    dict: replacer.DictMap): Promise < void > {
    // TODO:修复replaceWithSplit
    return utils.readFile(preUrl)
        .then((data) => utils.writeFile(postUrl,
            replacer.replaceWithSplit(data, dict).content));
}
export function isInIgnore(path: string, ignoreContent: string, extName: string = '.orz'): boolean {
    let returnValue = false;
    if (path.endsWith(extName)) { returnValue = true; }
    ignoreContent.replace(/\r\n/g, '\n').split('\n').forEach((str) => {
        if (str === '') return;
        const newPath = Path.resolve(Path.normalize(path));
        const newStr = Path.resolve(Path.normalize(str));
        if (newPath.startsWith(newStr)) returnValue = true;
    });
    return returnValue;
}
export function isInIgnoreFile(path: string, ignoreFile: string = '.忽略', extName: string = 'orz'): Promise < boolean > {
    return new Promise((resolve, reject) => {
        utils.readFile(ignoreFile).then((data) => {
            if (isInIgnore(path, data, extName)) resolve(true);
            else resolve(false);
        }, (err) => { reject(err); });
    });
}
/**
 * @description 翻译一个文件夹并写入一个文件内
 * @param {string} preUrl 被翻译的文件的路径
 * @param {string} postUrl 被写入内容的文件的路径
 * @return {Promise <string>} 返回一个Promise
 */
export function translaterFileTree(path: string,
    dict: replacer.DictMap,
    ignoreFile: string = '.忽略',
    extName: string = '.orz') {
    let ignoreContent = ignoreFile;
    // 获取ignore文件的内容
    utils.readFile(ignoreFile).then((data) => {
        ignoreContent = data;
        return utils.explorer(path);
    }).then((data) => { // 再进行文件树翻译
        Object.values(data).forEach((value) => {
            let encoding = '';
            if (value.encoding) encoding = value.encoding.toLowerCase();
            if (encoding === 'utf-8' && !isInIgnore(value.filename, ignoreContent)) {
                translateFile(value.filename, value.filename + extName, dict);
            }
        });
    });
}
