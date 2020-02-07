#!/usr/bin/env node
/**
 * @fileOverview 可执行文件入口
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */
const minimist = require('minimist');

const argv = minimist(process.argv);
console.log('Console Path:');
console.log(process.cwd());
console.log('Arguments:');
console.log(argv);

const index = require('../dist/main.js');

index.test();
