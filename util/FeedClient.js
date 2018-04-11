const request = require('request');
const jsonBuilder = require('./JsonBuilder');

var FeedClient = {};

FeedClient.fetchContent = (id, callback) => {
    if(id) {
        request('https://www.cbc.ca/json/cmlink/' + id, { json: true }, (err, res, body) => {
            if (err) { 
                console.log(err); 
            } else {
                //convert content JSON
                var json = jsonBuilder.buildContent(body);
                console.log(json);
                callback(json);
            }
        });
    }
}

FeedClient.fetchLineup = (id, callback) => {
    if(id) {
        request('https://www.cbc.ca/aggregate_api/v1/items?typeSet=cbc-ocelot&pageSize=10&page=1&source=Polopoly&orderLineupId=' + id, { json: true }, (err, res, body) => {
            if (err) { 
                console.log(err); 
            } else {
                var arr = jsonBuilder.buildLineup(body);
                console.log(arr);
                callback(arr);
            }
        });
    }
}

module.exports = FeedClient;