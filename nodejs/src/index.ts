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
exports.test = test;
exports.translaterFileTreeWithDictFile = translaterFileTreeWithDictFile;
exports.translaterFileWithDictFile = translaterFileWithDictFile;
exports.readDictFileByGithubRelease = readDictFileByGithubRelease;

// translaterFileTree(Path.normalize('D:/project/Orangex/nodejs/src/测试'), false, false);
// test();
// const argv = minimist(process.argv);
// console.log('Console Path:');
// console.log(process.cwd());
// console.log('Arguments:');
// console.log(argv);
