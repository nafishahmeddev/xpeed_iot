var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log(req.query);
  let message = {
    "version": "1.0",
    "sessionAttributes": {
      "key": "value"
    },
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": "Plain text string to speak",
        "playBehavior": "REPLACE_ENQUEUED"
      },
      "shouldEndSession": false
    }
  }

  res.send(JSON.stringify(message));
});

router.get('/', function(req, res, next) {
  res.json({
    error: true,
    message:"Sorry! I'm not available"
  });
});

module.exports = router;
