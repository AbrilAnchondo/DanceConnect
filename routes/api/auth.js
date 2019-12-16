const express = require('express');

//to use express router
const  router = express.Router();

const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

//@route - GET api/auth
//@description - Test Route
//@access -  Public

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

//@route - POST api/auth
//@description - Authenthicate user and get token
//@access - Public, purpose of this route is to get the token and access private routes

//this is a login
router.post('/', [
    check('email', 'Valid email is required')
        .isEmail(),
    check('password', 
        'Password is required')
        .exists()
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //destructuring to avoid repetition
        const { email, password } = req.body;

        try {
        //we need to check if there is not a user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials or user does not exist' }] });
        }
        
        //we need to match email and password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials or user does not exist' }] });
        }
         //Return jwt, get the payload
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, 
                    config.get('jwtSecret'),
                    { expiresIn: 36000 },
                    (err, token) => {
                        if(err) throw err;
                        res.json({ token });
                    }
                    );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);


//



module.exports = router;


