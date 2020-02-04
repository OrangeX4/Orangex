/**
* @fileOverview 替换的主函数库
* @author <a href="https://github.com/OrangeX4/">OrangeX4</a>
* @version 0.1
*/

//module.exports ={replaceContent:replaceContent};
var split = "￥";
exports.setSplit = setSplit;
exports.replaceContent = replaceContent;
exports.replaceWithSplit = replaceWithSplit;
exports.mergeDict = mergeDict;
exports.turnDict = turnDict;

/**
* @description 设置分隔符，默认为￥
* @param {String} splitVal 分隔符值
*/
function setSplit(splitVal) {
    split = splitVal;
}

/**
* @description 合并字典内的值,方式为浅层+覆盖
* @param {Object} arguments 参数群
* @return {Object} 返回合并后的字典
*/
function mergeDict() {
    mergeValue = {};
    for (i in arguments) {
        arg = arguments[i];
        for (j in arg) {
            mergeValue[j] = arg[j];
        }
    }
    return mergeValue;
}

/**
* @description 翻转字典的键与值,要求键与值一一对应
* @param {Object} dict 要翻转的字典
* @return {Object} 返回翻转后的字典
*/
function turnDict(dict) {
    returnDict = {};
    for (i in dict) {
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
* @param {Object} dict 要翻转的字典
* @return {Object} 返回翻转后的字典
*/
function replaceContent(content, dict) {
    // var dict = JSON.parse(dictionary);
    var patt = /[\u4E00-\u9FA5A-Za-z0-9_$-]+/g;
    // var match = unique(str.match(patt));  // 去重版本
    var match = content.match(patt);
    var fail = [];
    var success = [];
    // console.log(match);
    for (var i in match) {
        // console.log(match[i]);n
        if (dict[match[i]]) {
            content = content.replace(match[i], dict[match[i]]);
            success.push(match[i]);
        } else {
            fail.push(match[i]);
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
* @param {Object} dict 替换使用的字典
* @return {Object} 返回一个对象,结构为:
* {  content:"content",
*    returnArray:[{ content:'ChangedContent', success: [Array], fail: [Array] },"UnchangedContent"]
* }
*/
function replaceWithSplit(content, dict) {
    var strArray = content.split(split);
    var str = "";
    var objectArray = [];
    var returnValue = {};
    for (i in strArray) {
        if (i % 2 == 0) {
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