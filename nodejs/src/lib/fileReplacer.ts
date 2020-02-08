/**
 * @fileOverview 文件替换的主函数库
 * @author <a href="https://github.com/OrangeX4/">OrangeX4</a>
 * @version 0.1
 */
import * as replacer from './replacer';
import * as utils from './utils';

/**
 * @description 翻译一个文件并写入一个文件内
 * @param {string} preUrl 被翻译的文件的路径
 * @param {string} postUrl 被写入内容的文件的路径
 * @return {Promise <string>} 返回一个Promise
 */
export function translateFileAndSave(preUrl: string,
    postUrl: string,
    dict: replacer.DictMap): Promise < void > {
    return new Promise(utils.readFile(preUrl))
        .then((data) => new Promise(utils.writeFile(postUrl,
            replacer.replaceWithSplit(data, dict).content)));
}
