const express = require('express');

//to use express router
const  router = express.Router();
const { check, validationResult } = require('express-validator');

//bringing in user model
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//before every route you want to add 3 things:
//@route = request type GET api/users <- endpoint
//@description = Test route (other : resgister user, add profile)
//@access = whether is public or private, do you need a token

//this is a test route
//router.get('/', (req, res) => res.send('User route'));

//rount to register a new user
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Valid email is required')
        .isEmail(),
    check('password', 
        'Please enter a 6 or more character      password')
        .isLength({ min: 6 })
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //destructuring to avoid repetition
        const { name, email, password } = req.body;

        try {
        //we need to see if the user exist, send error if already does
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
        //Get user gravatar
        const avatar = gravatar.url({
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        //creates a new instances but doesnt save it yet
        user = new User({
            name,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);
        //salting pass:
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        //encrypt password using bcrypt

        //Return jwt
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

module.exports = router;


