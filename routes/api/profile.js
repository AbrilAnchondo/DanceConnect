const express = require('express');

//to use express router
const  router = express.Router();

//before every route you want to add 3 things:

//@route = request type GET api/prile <- endpoint
//@description = Test route (other : resgister user, add profile)
//@access = whether is public or private, do you need a token

//this is a test route
router.get('/', (req, res) => res.send('User profile'));

module.exports = router;