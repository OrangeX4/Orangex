#!/usr/bin/env node
/**
 * @fileOverview 可执行文件入口
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */
// const childProcess = require('child_process');
const Path = require('path');
const fs = require('fs');
const minimist = require('minimist');

const argv = minimist(process.argv);
// console.log('控制台目录:');
// console.log(process.cwd());
// console.log('命令行参数:');
// console.log(argv);

const index = require('../dist/main.js');

const dictFile = `${__dirname}/dict.json`;
const workPath = Path.normalize(process.cwd());
const helpInfo = `帮助:
使用"橙式 字典 一个词"查看'一个词'在字典中对应的映射值.
使用"橙式 更新字典"进行字典文件的更新.
使用"橙式 英转汉"可以将当前目录的文本文件替换成中文.(加上后缀后保存).
使用"橙式 英转汉 一个文件"可以转换'一个文件'成中文.
使用"橙式 英转汉 -深"可以替换当前目录及其深层目录所有文本文件替换成中文.
使用"橙式 英转汉 -志"可以输出一个日志, 可以用它来知道有哪些词转换失败.
命令"橙式 汉转英"用法同英转汉.注意:只会替换有后缀(如'.橙')的文件.
使用"命令 一个命令"可以将该命令转换成中文后执行
(使用'￥￥'代替'&&', 且命令不会改变当前终端状态).
------
提示:只支持UTF-8和ascii格式的文件.
提示:中文输入法下使用'Ctrl + .'可以替换中英文标点.
------
需要更多信息? 欢迎前往: https://github.com/OrangeX4/Orangex`;

// 更新字典文件
function updateDict() {
    console.log('正在更新字典文件, 请稍等一会:)');
    index.readDictFileByGithubRelease('https://api.github.com/repos/Orangex4/Orangex/releases/latest').then((dict) => {
        fs.writeFile(dictFile, dict, (err) => {
            if (err) console.log('读取最新字典失败!');
            else console.log('读取最新字典成功!');
        });
    });
}

// 判断字典文件是否存在, 不存在就执行updateDict, 存在就进一步判断
fs.exists(dictFile, (isExist) => {
    if (isExist) {
        if (argv._[2]) {
            switch (argv._[2]) {
                case '帮助':
                    console.log(helpInfo);
                    break;
                case '测试':
                    index.test();
                    break;
                case '字典':
                    if (argv._[3]) index.readDict(argv._[3], dictFile);
                    else console.log('请输入参数...');
                    break;
                case '更新字典':
                    updateDict();
                    break;
                case '英转汉':
                    if (argv._[3]) {
                        index.translaterFileWithDictFile(argv._[3], dictFile, true, argv.志);
                    } else {
                        index.translaterFileTreeWithDictFile(workPath, dictFile, true, argv.深, argv.志);
                    }
                    break;
                case '汉转英':
                    if (argv._[3]) {
                        index.translaterFileWithDictFile(argv._[3], dictFile, false, argv.志);
                    } else {
                        index.translaterFileTreeWithDictFile(workPath, dictFile, false, argv.深, argv.志);
                    }
                    break;
                default:
                    console.log(`未找到命令'${argv._[2]}'`);
                }
            } else {
                console.log('使用"橙式 帮助"命令可获取帮助信息:)');
        }
    } else {
        // 更新字典
        updateDict();
    }
});
