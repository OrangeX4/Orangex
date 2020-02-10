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
import * as replacer from './lib/replacer';
import * as utils from './lib/utils';


export function test() {
    mainTest();
}
export async function translaterFileTree(path: string, isWithExtname: boolean, isDeep: boolean) {
    const data = await utils.readWithWebAndRedirect();// .then((data) => {
    const dictionary = JSON.parse(data);
    const dict = replacer.mergeDict(dictionary.common, dictionary.computer);
    if (isWithExtname) fileReplacer.translaterFileTree(path, dict, isWithExtname, isDeep);
    else fileReplacer.translaterFileTree(path, replacer.turnDict(dict), isWithExtname, isDeep);
    // });
}

exports.test = test;
exports.translaterFileTree = translaterFileTree;

// translaterFileTree(Path.normalize('D:/project/Orangex/nodejs/src/测试'), true, false);
// test();
// const argv = minimist(process.argv);
// console.log('Console Path:');
// console.log(process.cwd());
// console.log('Arguments:');
// console.log(argv);
