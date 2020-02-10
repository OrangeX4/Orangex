#!/usr/bin/env node
/**
 * @fileOverview 可执行文件入口
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */
const minimist = require('minimist');
const Path = require('path');

const argv = minimist(process.argv);
console.log('Console Path:');
console.log(process.cwd());
console.log('Arguments:');
console.log(argv);

const index = require('../dist/main.js');

if (argv._[2]) {
    switch (argv._[2]) {
        case '帮助':
            console.log('帮助信息: 使用"橙式 测试"开始测试.');
            break;
        case '测试':
            index.test();
            break;
        case '英转汉':
            index.translaterFileTree(Path.normalize(process.cwd()), true, argv.深);
            // console.log(argv.深);
            break;
        case '汉转英':
            index.translaterFileTree(Path.normalize(process.cwd()), false, argv.深);
            break;
        default:
            console.log(`未找到命令'${argv._[2]}'`);
    }
} else {
    console.log('使用"橙式 帮助"命令可获取帮助信息:)');
}
