//module.exports ={replaceContent:replaceContent};
var split = "￥";
exports.setSplit = setSplit;
exports.replaceContent = replaceContent;
exports.replaceWithSplit = replaceWithSplit;
exports.mergeDict = mergeDict;
exports.turnDict = turnDict;

function setSplit(splitVar) {
    split = splitVar;
}

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