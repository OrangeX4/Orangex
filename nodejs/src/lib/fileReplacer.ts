/**
 * @fileOverview 文件替换的主函数库
 * @author <a href="https://github.com/OrangeX4/">OrangeX4</a>
 * @version 0.1
 */
import * as Path from 'path';
import * as replacer from './replacer';
import * as utils from './utils';

/**
 * @description 根据情况选择保存成的文件名
 * @param {string} preUrl 被翻译的文件的路径
 * @param {string} postUrl 被写入内容的文件的路径
 * @return {Promise <string>} 返回一个Promise
 */
function getSavedFileName(filename: string,
    dict: replacer.DictMap,
    isWithExtname: boolean,
    extName: string): string {
    if (isWithExtname) {
        return `${Path.dirname(filename)}/${replacer.replaceContent(Path.basename(filename), dict).content}${extName}`;
    }
    return `${Path.dirname(filename)}/${replacer.replaceContent(
        Path.basename(filename
        .slice(0, filename.length - extName.length)), dict)
        .content}`;
}
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
/**
 * @description 判断一个文件路径是否在忽略文件里面
 * @param {string} path 要判断的文件
 * @param {string} ignoreContent 忽略文件的内容,用来减少IO操作
 * @param {boolean} isWithExtname 英转汉就填true, 汉转英就填false
 * @return {boolean} 如果在忽略文件里就返回true, 不在就返回false
 */
export function isInIgnore(path: string,
    ignoreContent: string,
    isWithExtname: boolean,
    extName: string = '.橙'): boolean {
    let returnValue = false;
    if (isWithExtname) {
        if (path.endsWith(extName)) { returnValue = true; }
    } else if (!path.endsWith(extName)) { returnValue = true; }
    if (path.endsWith('.忽略')) { returnValue = true; }
    ignoreContent.replace(/\r\n/g, '\n').split('\n').forEach((str) => {
        if (str === '') return;
        const newPath = Path.resolve(Path.normalize(path));
        const newStr = Path.resolve(Path.normalize(str));
        if (newPath.startsWith(newStr)) returnValue = true;
    });
    return returnValue;
}
/**
 * @description 判断一个文件路径是否在忽略文件里面
 * @param {string} path 要判断的文件
 * @param {string} ignoreFilePath 忽略文件的内容,用来减少IO操作
 * @param {boolean} isWithExtname 英转汉就填true, 汉转英就填false
 * @return {Promise < boolean >} 一个Promise,用then调用后传入一个布尔值, 如果在忽略文件里就返回true, 不在就返回false
 */
export function isInIgnoreFile(path: string,
    ignoreFilePath: string = '.忽略',
    isWithExtname: boolean,
    extName: string): Promise < boolean > {
    return new Promise((resolve, reject) => {
        utils.readFile(ignoreFilePath).then((data) => {
            if (isInIgnore(path, data, isWithExtname, extName)) resolve(true);
            else resolve(false);
        }, (err) => { reject(err); });
    });
}
/**
 * @description 翻译一个文件夹并写入对应文件,加上拓展名
 * @param {string} path 被翻译的文件夹路径
 * @param {replacer.DictMap} dict 替换时使用的字典
 * @param {boolean} isWithExtname 英转汉就填true, 汉转英就填false, 默认为true
 * @param {boolean} isDeep 是否进入到子目录
 * @param {string} ignoreFilePath 忽略文件路径,可用相对路径
 * @param {string} extName 要加上的拓展名, 记得要包括点号, 默认'.orz'
 */
export function translaterFileTree(path: string,
    dict: replacer.DictMap,
    isWithExtname: boolean,
    isDeep: boolean,
    ignoreFilePath: string = '.忽略',
    extName: string = '.橙') {
    let ignoreContent = ignoreFilePath;
    // 获取ignore文件的内容
    utils.readFile(ignoreFilePath).then((data) => {
        ignoreContent = data;
        return utils.explorer(path, isDeep);
    }, () => utils.explorer(path, isDeep)).then((data) => { // 再进行文件树翻译
        Object.values(data).forEach((value) => {
            let encoding = '';
            if (value.encoding) encoding = value.encoding.toLowerCase();
            if (encoding === 'utf-8' && !isInIgnore(value.filename, ignoreContent, isWithExtname)) {
                // 真正重要的部分,在这里修改其他内容
                translateFile(value.filename,
                    getSavedFileName(value.filename, dict, isWithExtname, extName), dict);
                }
            },
        );
    });
}
export async function translaterFileTreeWithDictFile(path: string,
    dictFilePath: string,
    isWithExtname: boolean,
    isDeep: boolean) {
    const data = await utils.readFile(dictFilePath);// .then((data) => {
    const dictionary = JSON.parse(data);
    // TODO：修改这里的dictionary.computer
    const dict = replacer.mergeDict(dictionary.common, dictionary.computer);
    if (isWithExtname) translaterFileTree(path, dict, isWithExtname, isDeep);
    else translaterFileTree(path, replacer.turnDict(dict), isWithExtname, isDeep);
    // });
}
export async function translaterFileWithDictFile(path: string,
    dictFilePath: string,
    isWithExtname: boolean) {
    const data = await utils.readFile(dictFilePath);// .then((data) => {
    const dictionary = JSON.parse(data);
    // TODO：修改这里的dictionary.computer
    const dict = replacer.mergeDict(dictionary.common, dictionary.computer);
    if (isWithExtname) translateFile(path, getSavedFileName(path, dict, isWithExtname, '.橙'), dict);
    else translateFile(path, getSavedFileName(path, replacer.turnDict(dict), isWithExtname, '.橙'), dict);
    // });
}
