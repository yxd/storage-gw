//import { call } from 'sia.js'
const gw = require('sia.js');
const address = 'localhost:9980';
var Sia = {};
const localRepo = process.env.LOCAL_REPO || "/cbc/";
const remoteRepo = process.env.SIA_REPO || "/cbc/";
const fs = require('fs');


Sia.get = function(api, params) {
    try {
        const result = gw.call(address, api);
        return result;
      } catch (e) {
        console.error('error getting ' + address + api + ' result: ' + e.toString())
      }
}

Sia.post = function(api, reqBody) {
    try {
        const result = gw.call(address, 
            {            
                "url": api, 
                "method": "POST", 
                "json": true,
                "body": reqBody
            }
        );
        return result;
      } catch (e) {
        console.error('error getting ' + address + api + ' result: ' + e.toString())
      }
}

//Sia.get('/renter/downloadasync/test/story.json?destination=/tmp/test.json').then(function(value) {
//    console.log(value);
//});

Sia.saveObject = function(content, path) {
    var localPath = localRepo + path;
    console.log('contentid=' + content.id);
    var id = content.id;
    //save file to local
    fs.writeFileSync(localRepo + path, JSON.stringify(content));  

    //upload to Sia
    var api = '/renter/upload/' + path + '?source=' + localPath;
    Sia.post(api, "").then(function(value) {
        console.log("Uploaded " + path);
    });
}

Sia.getObject = function(path) {
    var content = {};
    var localPath = localRepo + path;
    //get file from local cache
    //TODO: if cache expired then download from Sia
    var expired = false;
    if(fs.existsSync(localPath)) {
        var content = fs.readFileSync(localPath);
    
        if(content && !expired) {
            var obj = JSON.parse(content);  
            return obj;
        }
    } 

    //otherwise download from Sia
    var api = "renter/downloadasync/" + path + "?destination=" + localPath;
    Sia.get(api).then(
        function(value) {
            console.log("Downloaded " + path);
        }
    )
    return content;
}

Sia.checkDir = function(dir) {
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

Sia.getContent = function(id) {
    return this.getObject("content/" + id + ".json");
}

Sia.getLineup = function(id) {
    return this.getObject("lineup/" + id + ".json");
}

Sia.saveContent = function(content) {
    this.checkDir(localRepo + "content/");
    this.saveObject(content, "content/" + content.id + ".json")
}

Sia.saveLineup = function(lineup) {
    this.checkDir(localRepo + "lineup/");
    this.saveObject(lineup, "lineup/" + lineup.id + ".json")
}

module.exports = Sia;