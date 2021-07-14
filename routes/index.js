var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  const body = req.body;
  const request = body.request;
  const type = request.type;
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
  if (request.type=="LaunchRequest"){
    message = {
      "version": "1.0",
      "response": {
        "outputSpeech": {
          "type": "PlainText",
          "text": `Hi! welcome to Xpeed Automation`,
          "playBehavior": "REPLACE_ENQUEUED"
        },
        "shouldEndSession": false
      }
    };
  }

  if(request.type=="IntentRequest") {
    switch (intent.name) {
      case "turnOn":
        var  device = intent.slots.device.value;
        //////

        if(_CLIENTS.hasOwnProperty("D1")){
          let __WS = _CLIENTS["D1"];
          let msg = {
            _uid: "hhhhh",
            _event: "set_value",
            _values: [255,255,255]

          }
          __WS.send(JSON.stringify(msg));
        }

        ///////
        message = {
          "version": "1.0",
          "response": {
            "outputSpeech": {
              "type": "PlainText",
              "text": `OK! turning on ${device}.`,
              "playBehavior": "REPLACE_ENQUEUED"
            },
            "shouldEndSession": true
          }
        };
        break;
      case "turnOff":
        var device = intent.slots.device.value;
        //////

        if(_CLIENTS.hasOwnProperty("D1")){
          let __WS = _CLIENTS["D1"];
          let msg = {
            _uid: "hhhhh",
            _event: "set_value",
            _values: [0,0,0]

          }
          __WS.send(JSON.stringify(msg));
        }

        ///////
        message = {
          "version": "1.0",
          "response": {
            "outputSpeech": {
              "type": "PlainText",
              "text": `OK! turning off ${device}.`,
              "playBehavior": "REPLACE_ENQUEUED"
            },
            "shouldEndSession": true
          }
        };
        break;
      case "AMAZON.FallbackIntent":
        message = {
          "version": "1.0",
          "response": {
            "outputSpeech": {
              "type": "PlainText",
              "text": `Sorry i don't know that`,
              "playBehavior": "REPLACE_ENQUEUED"
            },
            "shouldEndSession": true
          }
        };
        break;
    }
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
