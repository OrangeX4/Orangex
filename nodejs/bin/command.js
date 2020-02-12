#!/usr/bin/env node
/**
 * @fileOverview 命令入口
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */
const fs = require('fs');
const index = require('../dist/main.js');

const dictFile = `${__dirname}/dict.json`;

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
// console.log('aaa');
// 判断字典文件是否存在, 不存在就执行updateDict, 存在就进一步判断
fs.exists(dictFile, (isExist) => {
    if (isExist) {
        // 获取原命令
        let command = '';
        process.argv.forEach((value, i) => {
            if (i !== 0 && i !== 1) {
                command = `${command + value} `;
            }
        });
        command = command.trim();
        if (command === '') {
            console.log('没有输入任何命令.');
            return;
        }
        command = command.replace(/￥￥/g, '&&');
        // console.log(command);
        index.replaceCommand(`${command}`, dictFile);
    } else {
        // 更新字典
        updateDict();
    }
});
