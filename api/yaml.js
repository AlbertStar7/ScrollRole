var express = require('express');
var router = express.Router();

var YamlParser = require('../public/js/controller/yamlParser');

/* POST a string of YAML and get JSON. */
router.post('/parse', function(req, res, next) {
    var yamlStr = req.body.text;

    if (!_.isString(yamlStr)) {
        res.status(400).send("Must provide 'yaml' in POST body");
        return;
    }

    YamlParser.parseYaml(yamlStr)
        .done(function(json) {
            res.json(json);
        })
        .fail(function(e) {
            res.status(500).json(e);
        });
});

module.exports = router;
