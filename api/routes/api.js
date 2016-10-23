var request = require('request');
var jwt = require('jsonwebtoken');

exports.discoverykeys = function (req, res) {
    var domainName = req.query.d;
    var policy = req.query.p;
    var url = 'https://login.microsoftonline.com/' + domainName +
                'discovery/v2.0/keys?p=' + policy;

    request(url,function (err, response, body) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(body);
        }
    });
};