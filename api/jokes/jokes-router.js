//requirements
const router = require('express').Router();
const jokes = require('./jokes-data');


//endpoints
router.get('/', (req, res) => {
  res.status(200).json(jokes);
});

module.exports = router;
