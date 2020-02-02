// Test:
// var str = "jsx js ddd  ddd 中文 中Eng 1数字-Head $";
// var patt = /[\u4E00-\u9FA5A-Za-z0-9_$-]+/g;
// // var match = unique(str.match(patt));
// var match = str.match(patt);
// console.log(match);
// for (var i in match) {
//     //console.log(match[i]);
//     str = str.replace(match[i], "Test");
//     console.log(str);
// }
var str = "jsx js ddd  ddd 中文 中Eng 1数字-Head $";
var dict = '{"jsx":"爪纹","ddd":"顶顶顶"}';
console.log(replaceContent(str,dict));


function replaceContent(content, dictionary) {
    dict = JSON.parse(dictionary);
    var patt = /[\u4E00-\u9FA5A-Za-z0-9_$-]+/g;
    // var match = unique(str.match(patt));  // 去重版本
    var match = content.match(patt);
    var miss = [];
    console.log(match);
    for (var i in match) {
        // console.log(match[i]);n
        if (dict[match[i]]) {
            content = content.replace(match[i], dict[match[i]]);
        } else {
            miss.push(match[i]);
        }
        // console.log(str);
    }
    return {content:content,miss:miss};
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