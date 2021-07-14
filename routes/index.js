var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  console.log(req.query);
  let message = {
    "version": "string",
    "sessionAttributes": {
      "key": "value"
    },
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": "Plain text string to speak",
        "playBehavior": "REPLACE_ENQUEUED"
      },
      "card": {
        "type": "Standard",
        "title": "Title of the card",
        "text": "Text content for a standard card",
        "image": {
          "smallImageUrl": "https://url-to-small-card-image...",
          "largeImageUrl": "https://url-to-large-card-image..."
        }
      },
      "reprompt": {
        "outputSpeech": {
          "type": "PlainText",
          "text": "Plain text string to speak",
          "playBehavior": "REPLACE_ENQUEUED"
        }
      },
      "directives": [
        {
          "type": "InterfaceName.Directive"
        }
      ],
      "shouldEndSession": true
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
