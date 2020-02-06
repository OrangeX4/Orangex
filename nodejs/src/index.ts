/**
 * @fileOverview 模块入口
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */
import minimist from 'minimist';
// 进行测试
import './test/main.test';

const argv = minimist(process.argv);
console.log('Console Path:');
console.log(process.cwd());
console.log('Arguments:');
console.log(argv);
