const gw = require('sia.js');
const address = 'localhost:9980';
const localRepo = process.env.LOCAL_REPO || "/cbc/";
const remoteRepo = process.env.REMOTE_REPO || "cbc/";
const fs = require('fs');
const request = require('request');
const jsonBuilder = require('../util/JsonBuilder');
const feedClient = require('../util/FeedClient');

var Sia = {};

Sia.get = function(api) {
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

Sia.upload = function(localPath, remotePath) {
    //upload to remote
    var api = '/renter/upload/' + remotePath + '?source=' + localPath;
    this.post(api, "")
        .then(function(value) {
            console.log("Uploaded " + remotePath);
        }).catch(function(err) {
            console.error("Upload failed for " + remotePath +  " : " + err.message);
        }); 
}

Sia.saveObject = function(content, path) {
    var localPath = localRepo + path;
    var remotePath = remoteRepo + path;
    var id = content.id;
    //save file to local
    fs.writeFileSync(localRepo + path, JSON.stringify(content));  

    //delete from remote
    this.delete(remotePath)
        .then(function(value) {
            Sia.upload(localPath, remotePath);
        }).catch(function(err) {
            if(err.message.match(/no file/)) { //new file
                Sia.upload(localPath, remotePath);
            } else {
                console.error(err.message);
            }
        });
}

Sia.delete = function(path) {
    var api = '/renter/delete/' + path;
    return this.post(api, "");
}

Sia.ingest = function(path) {
    if(path.startsWith('content/')) { 
        //generate from Polopoly JSON
        var id = path.replace('content/', '').replace('.json', '');
        feedClient.fetchContent(id, (json) => Sia.saveContent(json));
    } else if (path.startsWith('lineup/')) {
        //generate from Aggregator API
        var id = path.replace('lineup/', '').replace('.json', '');
        var arr = feedClient.fetchLineup(id, (arr) => {
            Sia.saveLineup(id, arr);
            arr.forEach(item => {
                feedClient.fetchContent(item.id, (json) => Sia.saveContent(json));
            });
        });
    }
}

Sia.getObject = function(path) {
    var content = {};
    var localPath = localRepo + path;
    var remotePath = remoteRepo + path;
    //get file from local cache
    //TODO: if cache expired then download from Sia
    var expired = false;
    if(fs.existsSync(localPath)) {
        var content = fs.readFileSync(localPath);
    
        if(content && !expired) {
            try {
                var obj = JSON.parse(content);
                return obj;
            } catch(e) {
                console.error(e.message);
                return {};
            }
        }
    } 

    //otherwise download from Sia
    var api = "/renter/downloadasync/" + remotePath + "?destination=" + localPath;
    this.get(api)
        .then(
            function(value) {
                console.log("Downloaded " + remotePath);
            }
        ).catch(function(err) {
            console.error("Download failed: " + err.message);

            if(err.message.match(/no file/)) {
                Sia.ingest(path); // ingest content/lineup on-demand
            }

        });
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

Sia.saveLineup = function(id, lineup) {
    this.checkDir(localRepo + "lineup/");
    this.saveObject(lineup, "lineup/" + id + ".json")
}

module.exports = Sia;