var express = require('express');
const userRouter = require("./user");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    error: true,
    message:"Yuppie! I'm running."
  });
});

module.exports = router;
