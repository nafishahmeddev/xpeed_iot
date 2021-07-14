var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  const body = req.body;
  const  request = body.request;
  const intent = request.intent;

  var message = {
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
  };
  switch (intent.name){
    case "turnOn":
      let device = intent.slots.device.value;
      message = {
        "version": "1.0",
        "response": {
          "outputSpeech": {
            "type": "PlainText",
            "text": `${device} is not responding...`,
            "playBehavior": "REPLACE_ENQUEUED"
          },
          "shouldEndSession": false
        }
      };
      break;
  }



  res.json(message);
});

router.get('/', function(req, res, next) {
  res.json({
    error: true,
    message:"Sorry! I'm not available"
  });
});

module.exports = router;
