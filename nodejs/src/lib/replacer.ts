/**
* @fileOverview 替换的主函数库
* @author <a href="https://github.com/OrangeX4/">OrangeX4</a>
* @version 0.1
*/

/**
* @describe 键值对字典
*/
interface DictMap {
    [index:string]:string
}

//module.exports ={replaceContent:replaceContent};
var split = "￥";
// exports.setSplit = setSplit;
// exports.replaceContent = replaceContent;
// exports.replaceWithSplit = replaceWithSplit;
// exports.mergeDict = mergeDict;
// exports.turnDict = turnDict;

/**
* @description 设置分隔符，默认为￥
* @param {String} splitVal 分隔符值
*/
export function setSplit(splitVal:string):void {
    split = splitVal;
}

/**
* @description 合并字典内的值,方式为后者覆盖前者
* @param {DictMap[]} arguments 参数群
* @return {DictMap} 返回合并后的字典
*/
export function mergeDict(...args:DictMap[]) {
    var mergeValue:DictMap = {};
    for (var i in args) {
        var arg = args[i];
        for (var j in arg) {
            mergeValue[j] = arg[j];
        }
    }
    return mergeValue;
}

/**
* @description 翻转字典的键与值,要求键与值一一对应
* @param {DictMap} dict 要翻转的字典
* @return {DictMap} 返回翻转后的字典
*/
export function turnDict(dict:DictMap) {
    var returnDict:DictMap = {};
    for (var i in dict) {
        if (returnDict[dict[i]]) {
            throw {
                name: "TypeError",
                message: `字典的键值对没有唯一对应关系:${returnDict[dict[i]]}:${dict[i]}与${i}:${dict[i]}冲突.`
            }
        } else {
            returnDict[dict[i]] = i;
        }
    }
    return returnDict;
}

/**
* @description 翻转字典的键与值,要求键与值一一对应
* @param {DictMap} dict 要翻转的字典
* @return {DictMap} 返回翻转后的字典
*/
export function replaceContent(content:string, dict:DictMap) {
    // var dict = JSON.parse(dictionary);
    var patt = /[\u4E00-\u9FA5A-Za-z0-9_$-]+/g;
    // var match = unique(str.match(patt));  // 去重版本
    var match = content.match(patt);
    var fail = [];
    var success = [];
    // console.log(match);
    for (var i in match) {
        // console.log(match[i]);n
        let index = parseInt(i);
        if (dict[match[index]]) {
            content = content.replace(match[index], dict[match[index]]);
            success.push(match[index]);
        } else {
            fail.push(match[index]);
        }
        // console.log(str);
    }
    return {
        content: content,
        success: success,
        fail: fail
    };
}

/**
* @description 带有分隔符的文本替换
* @param {String} content 要被替换的文本
* @param {DictMap} dict 替换使用的字典
* @return {DictMap} 返回一个对象,结构为:
* {  content:"content",
*    returnArray:[{ content:'ChangedContent', success: [Array], fail: [Array] },"UnchangedContent"]
* }
*/
export function replaceWithSplit(content:string, dict:DictMap) {
    var strArray = content.split(split);
    var str = "";
    var objectArray = [];
    var returnValue;
    for (let i in strArray) {
        if (parseInt(i) % 2 == 0) {
            returnValue = replaceContent(strArray[i], dict);
            str = str + returnValue.content;
            objectArray.push(returnValue);
        } else {
            str = str + strArray[i];
            objectArray.push(strArray[i]);
        }
    }
    return {
        content: str,
        returnArray: objectArray
    };
}

// function unique(arr) {
//     var res = [];
//     var obj = {};
//     for (var i = 0; i < arr.length; i++) {
//         if (!obj[arr[i]]) {
//             obj[arr[i]] = 1;
//             res.push(arr[i]);
//         }
//     }
//     return res;
// }