/**
 * @fileOverview 模块入口
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */
// import minimist from 'minimist';
// 进行测试
// import * as Path from 'path';
import mainTest from './test/main.test';
import * as fileReplacer from './lib/fileReplacer';
// import * as replacer from './lib/replacer';
import * as utils from './lib/utils';
import { turnDict } from './lib/replacer';
// import { replaceWithSplit } from './lib/replacer';


export function test() {
    mainTest();
}
export async function translaterFileWithDictFile(path: string,
    dictFilePath: string,
    isWithExtname: boolean) {
        fileReplacer.translaterFileWithDictFile(path, dictFilePath, isWithExtname);
}
export async function translaterFileTreeWithDictFile(path: string,
    dictFilePath: string,
    isWithExtname: boolean,
    isDeep: boolean) {
        fileReplacer.translaterFileTreeWithDictFile(path, dictFilePath, isWithExtname, isDeep);
}
export function readDictFileByGithubRelease(url: string): Promise<string> {
    return utils.readWithWebAndRedirect(url);
}
export async function readDict(content: string, dictFilePath: string) {
    const data = await utils.readFile(dictFilePath);// .then((data) => {
    const dict = JSON.parse(data).common;
    if (dict[content]) console.log(dict[content]);
    else if (turnDict(dict)[content]) console.log(turnDict(dict)[content]);
    else console.log(`错误: 未找到"${content}"的映射值`);
    // console.log(replaceWithSplit(content, dict).content);
}
exports.test = test;
exports.translaterFileTreeWithDictFile = translaterFileTreeWithDictFile;
exports.translaterFileWithDictFile = translaterFileWithDictFile;
exports.readDictFileByGithubRelease = readDictFileByGithubRelease;
exports.readDict = readDict;

// translaterFileTree(Path.normalize('D:/project/Orangex/nodejs/src/测试'), false, false);
// test();
// const argv = minimist(process.argv);
// console.log('Console Path:');
// console.log(process.cwd());
// console.log('Arguments:');
// console.log(argv);
