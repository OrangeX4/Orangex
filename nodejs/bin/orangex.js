#!/usr/bin/env node
/**
 * @fileOverview 可执行文件入口
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */
const childProcess = require('child_process');
const Path = require('path');
const fs = require('fs');
const minimist = require('minimist');

const argv = minimist(process.argv);
console.log('控制台目录:');
console.log(process.cwd());
console.log('命令行参数:');
console.log(argv);

const index = require('../dist/main.js');

function callback(err) {
    if (err) console.log('读取最新字典失败!');
    else console.log('读取最新字典成功!');
}

if (argv._[2]) {
    switch (argv._[2]) {
        case '帮助':
            console.log('帮助信息: 使用"橙式 测试"开始测试.');
            break;
        case '测试':
            index.test();
            break;
        case '更新字典':
            console.log('正在更新字典文件...');
            index.readDictFileByGithubRelease('https://api.github.com/repos/Orangex4/Orangex/releases/latest').then((dict) => {
            fs.writeFile(`${Path.dirname(argv._[1])}/dict.json`, dict, callback);
            });
            break;
        case '英转汉':
            try {
                index.translaterFileTree(Path.normalize(process.cwd()), `${Path.dirname(argv._[1])}/dict.json`, true, argv.深);
            } catch (err) {
                childProcess.exec('橙式 更新字典', (error) => {
                    if (error !== null) {
                      console.log(`运行错误！: ${error}`);
                    } else index.translaterFileTree(Path.normalize(process.cwd()), `${Path.dirname(argv._[1])}/dict.json`, true, argv.深);
                });
            }
            break;
        case '汉转英':
            try {
                index.translaterFileTree(Path.normalize(process.cwd()), `${Path.dirname(argv._[1])}/dict.json`, false, argv.深);
            } catch (err) {
                childProcess.exec('橙式 更新字典', (error) => {
                    if (error !== null) {
                      console.log(`运行错误！: ${error}`);
                    } else index.translaterFileTree(Path.normalize(process.cwd()), `${Path.dirname(argv._[1])}/dict.json`, false, argv.深);
                });
            }
            break;
        default:
            console.log(`未找到命令'${argv._[2]}'`);
        }
    } else {
        console.log('使用"橙式 帮助"命令可获取帮助信息:)');
}
