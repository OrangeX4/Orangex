/**
 * @fileOverview 文件替换的主函数库
 * @author <a href="https://github.com/OrangeX4/">OrangeX4</a>
 * @version 0.1
 */
import * as Path from 'path';
import * as replacer from './replacer';
import * as utils from './utils';

export interface LogContent {
    失败:FailureLog
}
interface FailureLog {
    [index: string]: string[]
}

/**
 * @description 根据情况选择保存成的文件名,同步函数
 * @param {string} filename 被翻译的文件名
 * @param {replacer.DictMap} dict 使用的字典
 * @param {boolean} isWithExtname 是否带后缀
 * @param {boolean} extName 拓展名
 * @return {Promise <string>} 返回应该保存成的文件名
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
    dict: replacer.DictMap): Promise < void | replacer.ObjectBySplit > {
    // TODO:修复replaceWithSplit
    return utils.readFile(preUrl)
        .then((data) => {
            const returnObject = replacer.replaceWithSplit(data, dict);
            utils.writeFile(postUrl, returnObject.content);
            return returnObject;
        }, () => {
                console.log(`错误: 未找到文件"${preUrl}"`);
            });
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
    extName: string): boolean {
    let returnValue = false;
    if (isWithExtname) {
        if (path.endsWith(extName)) { returnValue = true; }
    } else if (!path.endsWith(extName)) { returnValue = true; }
    if (path.endsWith('.忽略')) { returnValue = true; }
    if (path.endsWith('.配置')) { returnValue = true; }
    if (path.endsWith('.日志')) { returnValue = true; }
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
    ignoreFilePath: string,
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
 * @param {string} configFilePath 配置文件路径,可用相对路径
 * @param {string} extName 要加上的拓展名, 记得要包括点号, 默认'.橙'
 */
export function translaterFileTree(path: string,
    dict: replacer.DictMap,
    isWithExtname: boolean,
    isDeep: boolean,
    isSaveLog: boolean,
    ignoreFilePath: string = '.忽略',
    extName: string = '.橙') {
    let ignoreContent = ignoreFilePath;
    const logContent: LogContent = { 失败: {} };
    // 获取ignore文件的内容
    utils.readFile(ignoreFilePath).then((data) => {
        ignoreContent = data;
        return utils.explorer(path, isDeep);
        // ignore文件为空就直接explorer
    }, () => utils.explorer(path, isDeep)).then((data) => { // 再进行文件树翻译
        // 用promises来并行执行每一个文件的翻译
        const promises: Promise<void | replacer.ObjectBySplit>[] = [];
        Object.values(data).forEach((value) => {
            let encoding = '';
            if (value.encoding) encoding = value.encoding.toLowerCase();
            if (encoding === 'utf-8' && !isInIgnore(value.filename, ignoreContent, isWithExtname, extName)) {
                // 真正重要的部分,在这里修改其他内容
                promises.push(
                    translateFile(value.filename, getSavedFileName(value.filename, dict, isWithExtname, extName), dict).then((returnObject) => {
                        console.log(`转换文件:${Path.normalize(value.filename)}`);
                        if (isSaveLog && returnObject) {
                            logContent.失败[Path.normalize(value.filename)] = [];
                            returnObject.returnArray.forEach((returnValue) => {
                                if (typeof (returnValue) === 'string') return;
                                logContent.失败[Path.normalize(value.filename)].push(...returnValue.fail);
                                logContent.失败[Path.normalize(value.filename)] = replacer.unique(logContent.失败[Path.normalize(value.filename)]);
                            });
                        }
                    }));
                }
            },
        );
        // Promise.all来并行执行各个文件翻译的promise
        return Promise.all(promises);
    }).then(() => {
        // 保存日志
        if (isSaveLog) {
            utils.writeFile('.日志', JSON.stringify(logContent, null, 2))
                .then(() => console.log('输出日志成功!'), () => console.log('输出日志失败!'));
        }
    });
}
export async function translaterFileTreeWithDictFile(path: string,
    dictFilePath: string,
    isWithExtname: boolean,
    isDeep: boolean,
    isSaveLog: boolean) {
    const data = await utils.readFile(dictFilePath);// .then((data) => {
    const dictionary = JSON.parse(data);
    // TODO：修改这里的dictionary.computer
    const dict = replacer.mergeDict(dictionary.common, dictionary.computer);
    if (isWithExtname) translaterFileTree(path, dict, isWithExtname, isDeep, isSaveLog);
    else translaterFileTree(path, replacer.turnDict(dict), isWithExtname, isDeep, isSaveLog);
    // });
}
export async function translaterFileWithDictFile(path: string,
    dictFilePath: string,
    isWithExtname: boolean,
    isSaveLog: boolean,
    extName: string = '.橙') {
    const data = await utils.readFile(dictFilePath);// .then((data) => {
    const dictionary = JSON.parse(data);
    // TODO：修改这里的dictionary.computer
    const dict = replacer.mergeDict(dictionary.common, dictionary.computer);
    // 根据isWithExtname选择是否翻转字典, 即英转汉还是汉转英
    let newDict;
    if (isWithExtname) newDict = dict;
    else newDict = replacer.turnDict(dict);
    translateFile(path, getSavedFileName(path, newDict, isWithExtname, extName), dict).then((returnObject) => {
        if (isSaveLog && data) {
            const logContent: LogContent = { 失败: {} };
            // logContent.失败[path] = data.returnArray
            if (returnObject) {
                logContent.失败[Path.normalize(path)] = [];
                returnObject.returnArray.forEach((returnValue) => {
                    if (typeof (returnValue) === 'string') return;
                    logContent.失败[Path.normalize(path)].push(...returnValue.fail);
                    logContent.失败[Path.normalize(path)] = replacer.unique(logContent.失败[Path.normalize(path)]);
                });
            }
            utils.writeFile('.日志', JSON.stringify(logContent, null, 2))
            .then(() => console.log('输出日志成功!'), () => console.log('输出日志失败!'));
        }
    });
}
