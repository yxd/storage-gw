
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var gw = require('../storage/Sia');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/:id', function (req, res) {
    var lineup = req.body;
    var id = req.params.id;
    if(lineup && id) {
        //save into SIA
        gw.saveLineup(id, lineup);

        res.status(200).send(lineup);
        console.log('Posted ' + lineup);
    } else {
        res.status(400).send({"Error":"Nothing to POST"});
    }
});

router.get('/:id', function (req, res) {
    var lineup = [];
    var id = req.params.id;
    //retrieve from SIA
    lineup = gw.getLineup(id);

    if(lineup) {
        res.status(200).send(lineup);
    } else {
        res.status(404).send([]);
    }
});



module.exports = router;
