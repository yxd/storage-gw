
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var gw = require('../storage/Sia');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', function (req, res) {
    var content = req.body;
    if(content) {
        //save into SIA
        gw.saveContent(content);

        res.status(200).send(content);
        console.log('Posted ' + content.id);
    } else {
        res.status(400).send({"Error":"Nothing to POST"});
    }
});

router.post('/ingest/:id', function (req, res) {
    var id = req.params.id;
    if(id) {
        //save into SIA
        gw.ingest('content/'+id);

        res.status(200).send({});
        console.log('Ingested ' + id);
    } else {
        res.status(400).send({"Error":"Nothing to POST"});
    }
});

router.get('/:id', function (req, res) {
    var content = {};
    var id = req.params.id;
    //retrieve from SIA
    content = gw.getContent(id);

    if(content.id) {
        res.status(200).send(content);
    } else {
        res.status(404).send({});
    }
});



module.exports = router;
