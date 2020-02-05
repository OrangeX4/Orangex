/**
 * @fileOverview 替换的主函数库
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */

/**
 * @describe 键值对字典
 */
interface DictMap {
    [index: string]: string
}
interface ObjectReplaced {
    content: string,
    success: string[],
    fail: string[]
}

// module.exports ={replaceContent:replaceContent};
let split = '￥';
// exports.setSplit = setSplit;
// exports.replaceContent = replaceContent;
// exports.replaceWithSplit = replaceWithSplit;
// exports.mergeDict = mergeDict;
// exports.turnDict = turnDict;

/**
 * @description 设置分隔符，默认为￥
 * @param {String} splitVal 分隔符值
 */
export function setSplit(splitVal: string): void {
    split = splitVal;
}

/**
 * @description 合并字典内的值,方式为后者覆盖前者
 * @param {DictMap[]} arguments 参数群
 * @return {DictMap} 返回合并后的字典
 */
export function mergeDict(...args: DictMap[]): DictMap {
    const mergeValue: DictMap = {};
    Object.values(args).forEach((arg) => {
        Object.keys(arg).forEach((j) => {
            mergeValue[j] = arg[j];
        });
    });
    return mergeValue;
}

/**
 * @description 翻转字典的键与值,要求键与值一一对应
 * @param {DictMap} dict 要翻转的字典
 * @return {DictMap} 返回翻转后的字典
 */
export function turnDict(dict: DictMap): DictMap {
    const returnDict: DictMap = {};
    Object.keys(dict).forEach((i) => {
        if (returnDict[dict[i]]) {
            throw new TypeError(`字典的键值对没有唯一对应关系:${returnDict[dict[i]]}:${dict[i]}与${i}:${dict[i]}冲突.`);
        } else {
            returnDict[dict[i]] = i;
        }
    });
    // for (const i in dict) {
    //     if (returnDict[dict[i]]) {
    //         throw new TypeError(
    //             `字典的键值对没有唯一对应关系:${returnDict[dict[i]]}:${dict[i]}与${i}:${dict[i]}冲突.`);
    //     } else {
    //         returnDict[dict[i]] = i;
    //     }
    // }
    return returnDict;
}

/**
 * @description 翻转字典的键与值,要求键与值一一对应
 * @param {DictMap} dict 要翻转的字典
 * @return {DictMap} 返回翻转后的字典
 */
export function replaceContent(contentStr: string, dict: DictMap): ObjectReplaced {
    // let dict = JSON.parse(dictionary);
    const patt = /[\u4E00-\u9FA5A-Za-z0-9_$-]+/g;
    // let match = unique(str.match(patt));  // 去重版本
    const match = contentStr.match(patt);
    let content = '';
    const fail:string[] = [];
    const success:string[] = [];
    // console.log(match);
    // Object.keys(match).forEach((i) => {
    //     // console.log(match[i]);n
    //     const index = parseInt(i, 10);
    //     if (dict[aMatch]) {
    //         content = content.replace(aMatch, dict[aMatch]);
    //         success.push(aMatch);
    //     } else {
    //         fail.push(aMatch);
    //     }
    //     // console.log(str);
    // });
    if (!match) { return { content: '', success: [], fail: [] }; }
    Object.values(match).forEach((aMatch) => {
        if (dict[aMatch]) {
            content = contentStr.replace(aMatch, dict[aMatch]);
            success.push(aMatch);
        } else {
            fail.push(aMatch);
        }
        // console.log(str);
    });

    return {
        content,
        success,
        fail,
    };
}

/**
 * @description 带有分隔符的文本替换
 * @param {String} content 要被替换的文本
 * @param {DictMap} dict 替换使用的字典
 * @return {DictMap} 返回一个对象,结构为:
 * {  content:'content',
 *    returnArray:[{ content:'ChangedContent', success: [Array], fail: [Array] },'UnchangedContent']
 * }
 */
export function replaceWithSplit(content: string, dict: DictMap): {
    content: string,
    returnArray: (string | ObjectReplaced)[]
} {
    const strArray = content.split(split);
    let str = '';
    const objectArray:(string | ObjectReplaced)[] = [];
    let returnValue;
    Object.keys(strArray).forEach((i) => {
        const index = parseInt(i, 10);
        if (index % 2 === 0) {
            returnValue = replaceContent(strArray[index], dict);
            str += returnValue.content;
            objectArray.push(returnValue);
        } else {
            str += strArray[index];
            objectArray.push(strArray[index]);
        }
    });

    return {
        content: str,
        returnArray: objectArray,
    };
}

// function unique(arr) {
//     let res = [];
//     let obj = {};
//     for (let i = 0; i < arr.length; i++) {
//         if (!obj[arr[i]]) {
//             obj[arr[i]] = 1;
//             res.push(arr[i]);
//         }
//     }
//     return res;
// }
