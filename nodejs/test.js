var replacer = require('./replacer');
var utils = require('./utils');
var str = "jsx js if  ddd  ddd ￥中文 中Eng￥ 1数字-Head $";
// var str = `function replaceContent(content, dict) {
//     // var dict = JSON.parse(dictionary);
//     var patt = /[\u4E00-\u9FA5A-Za-z0-9_$-]+/g;
//     // var match = unique(str.match(patt));  // 去重版本
//     var match = content.match(patt);
//     var fail = [];
//     var success = [];
//     // console.log(match);
//     for (var i in match) {
//         // console.log(match[i]);n
//         if (dict[match[i]]) {
//             content = content.replace(match[i], dict[match[i]]);
//             success.push(match[i]);
//         } else {
//             fail.push(match[i]);
//         }
//         // console.log(str);
//     }
//     return {content:content,success:success,fail:fail};
// }`;
utils.readWithWebAndRedirect(testFunc);

function testFunc(dict) {
    // console.log(dict);
    replacer.setSplit("￥");
    // var dict = {"jsx":"爪纹","ddd":"顶顶顶"};
    var returnObject = replacer.replaceWithSplit(str, JSON.parse(dict).common);
    console.log("All:");
    console.log(returnObject);
    // console.log("Array content:");
    // console.log(returnObject.returnArray[0]);
    console.log("Content:");
    console.log(returnObject.content);

}