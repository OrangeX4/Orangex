/* eslint-disable */
var fs = require('fs');
    var jschardet = require('jschardet');
    util = require('util');
    path = "D:/project/Orangex/nodejs/src";
    var data = [];
 
    function explorer(path){
        fs.readdir(path, function(err, files){
            //err 为错误 , files 文件名列表包含文件夹与文件
            if(err){
                console.log('error:\n' + err);
                return;
            }
            var a = 0;
 
            files.forEach(function(file){
 
                fs.stat(path + '/' + file, function(err, stat){
                    if(err){console.log(err); return;}
                    if(stat.isDirectory()){                
                        // 如果是文件夹遍历
                        explorer(path + '/' + file);
                    }else{
                        // 读出所有的文件
                        var str = fs.readFileSync(path + '/' + file);
                        var result = jschardet.detect(str);
                        var item = {};
                        item.filename = path + '/' + file;
                        item.encoding = result.encoding;
                        item.confidence = result.confidence;
                        item.source = path;
 
                        console.log('编码方式:'+result.encoding+"; "+result.confidence);
                        console.log('文件名:' + path + '/' + file);
                        data.push(item);
                    }              
                });
                 
            });
        });
    }
 
explorer(path);