/**
* @fileOverview 模块入口
* @author <a href="https://github.com/OrangeX4/">OrangeX4</a>
* @version 0.1
*/
var argv = require('minimist')(process.argv);
console.log("Arguments:");
console.log(argv);

// 进行测试
require('./test/main.test');