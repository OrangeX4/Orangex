var replacer = require('./replacer');

var str = "jsx js ddd  ddd 中文 中Eng 1数字-Head $";
var dict = {"jsx":"爪纹","ddd":"顶顶顶"};
console.log(replacer.replaceContent(str,dict));