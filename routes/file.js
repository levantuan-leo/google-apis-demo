const router = require('express').Router();
var formidable = require('formidable');

router.post('/upload', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      res.write('File uploaded');
      res.end();
    });
});

module.exports = router;