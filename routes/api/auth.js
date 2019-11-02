const express = require('express');

//to use express router
const  router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

//before every route you want to add 3 things:

//@route = request type GET api/auth <- endpoint
//@description = Test route (other : resgister user, add profile)
//@access = whether is public or private, do you need a token

//this is a test route
//to log in send the token and get back user data
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;


