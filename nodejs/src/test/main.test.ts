var replacer = require('../lib/replacer');
var utils = require('../lib/utils');
var str = "jsx js  default if  ddd ￥中文注释￥ 1数字-Head $";
{
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
}
// utils.readWithWebAndRedirect(testFunc);
utils.readWithFile(testFunc);
var testDict = {a:"1",b:"2",c:"3",d:"5",e:"6"}
console.log("Merge:");
console.log(replacer.mergeDict(
    {a:"1",b:"2",c:"3"},
    {c:"4",d:"5",e:"6"}
));
console.log("Turn:");
console.log(replacer.turnDict(testDict));


function testFunc(dict:string) {
    replacer.setSplit("￥");
    var dictionary =  JSON.parse(dict);
    var mergeDict =  replacer.mergeDict(dictionary.common,dictionary.computer);
    var returnObject = replacer.replaceWithSplit(str,mergeDict);
    console.log("All:");
    console.log(returnObject);
    // console.log("Array content:");
    // console.log(returnObject.returnArray[0]);
    console.log("Content:");
    console.log(returnObject.content);
    console.log("Translater:");
    console.log(replacer.replaceWithSplit(returnObject.content,replacer.turnDict(mergeDict)).content);

}