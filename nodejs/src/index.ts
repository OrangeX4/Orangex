/**
 * @fileOverview 模块入口
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */
// import minimist from 'minimist';
// 进行测试
// import * as Path from 'path';
// import * as fs from 'fs';
import * as childProcess from 'child_process';
// import { promisify } from 'util';
import * as os from 'os';
import * as iconv from 'iconv-lite';
import mainTest from './test/main.test';
import * as fileReplacer from './lib/fileReplacer';
import * as replacer from './lib/replacer';
import * as utils from './lib/utils';


// const encoding = 'cp936';
// const binaryEncoding = 'binary';

export function test() {
    mainTest();
}
export async function replaceCommand(command: string, dictFilePath: string) {
    // console.log(`系统类型:${os.platform().toString()}`);
    const data = await utils.readFile(dictFilePath);
    const dictionary = JSON.parse(data);
    const dict = replacer.mergeDict(dictionary.common, dictionary.command);
    const comm = replacer.replaceWithSplit(command, replacer.turnDict(dict), false).content;
    childProcess.exec(comm, {
        encoding: 'buffer',
    }, (err, stdout, stderr) => {
        if (err) {
            console.log(`命令执行错误!\n命令:${comm}\n错误:\n${err.message}\n翻译:\n${replacer.replaceWithSplit(err.message, dict).content}`);
        } else if (os.platform().toString() === 'win32') {
            // TODO: 解决编码问题
            const oriStdout = iconv.decode(stdout, 'cp936');
            const oriStderr = iconv.decode(stderr, 'cp936');
            const newStdout = replacer.replaceWithSplit(oriStdout, dict).content;
            const newStderr = replacer.replaceWithSplit(oriStderr, dict).content;
            if (oriStdout !== '' || oriStderr !== '') {
                console.log('---输出---');
                console.log(oriStdout, oriStderr);
                console.log('---翻译---');
                console.log(newStdout, newStderr);
            }
            // console.log(iconv.decode(stdout, 'cp936'), iconv.decode(stderr, 'cp936'));
        } else {
            const oriStdout = stdout.toString();
            const oriStderr = stderr.toString();
            const newStdout = replacer.replaceWithSplit(oriStdout, dict).content;
            const newStderr = replacer.replaceWithSplit(oriStderr, dict).content;
            if (oriStdout !== '' || oriStderr !== '') {
                console.log('---输出---');
                console.log(oriStdout, oriStderr);
                console.log('---翻译---');
                console.log(newStdout, newStderr);
            }
        }
    });
}
// replaceCommand('dir', 'D:/project/Orangex/nodejs/bin/dict.json');
export async function translaterFileWithDictFile(path: string,
    dictFilePath: string,
    isWithExtname: boolean,
    isSaveLog: boolean) {
    fileReplacer.translaterFileWithDictFile(path, dictFilePath, isWithExtname, isSaveLog);
}
export async function translaterFileTreeWithDictFile(path: string,
    dictFilePath: string,
    isWithExtname: boolean,
    isDeep: boolean,
    isSaveLog: boolean) {
    fileReplacer.translaterFileTreeWithDictFile(path, dictFilePath, isWithExtname, isDeep, isSaveLog);
}
export function readDictFileByGithubRelease(url: string): Promise < string > {
    return utils.readWithWebAndRedirect(url);
}
export async function readDict(content: string, dictFilePath: string) {
    const data = await utils.readFile(dictFilePath); // .then((data) => {
    const dict = JSON.parse(data).common;
    if (dict[content]) console.log(dict[content]);
    else if (replacer.turnDict(dict)[content]) console.log(replacer.turnDict(dict)[content]);
    else console.log(`错误: 未找到"${content}"的映射值`);
    // console.log(replaceWithSplit(content, dict).content);
}
exports.test = test;
exports.replaceCommand = replaceCommand;
exports.translaterFileTreeWithDictFile = translaterFileTreeWithDictFile;
exports.translaterFileWithDictFile = translaterFileWithDictFile;
exports.readDictFileByGithubRelease = readDictFileByGithubRelease;
exports.readDict = readDict;


// translaterFileTreeWithDictFile('D:/project/Orangex/nodejs/src/测试', 'D:/project/Orangex/nodejs/bin/dict.json', false, false, true);
// test();

// const oriData = JSON.parse(fs.readFileSync('D:\\project\\Orangex\\nodejs\\bin\\dict.json', { encoding: 'utf-8' }).toString());
// const othData = JSON.parse(fs.readFileSync('D:\\project\\Orangex\\map\\dict.json', { encoding: 'utf-8' }).toString());
// console.log(replacer.mergeDictFile(oriData, othData));
