const express = require('express');

//to use express router
const  router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

//bringing in all other models
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

//@route = request type POST api/posts <- endpoint
//@description = Add a post / create post
//@access = whether is public or private, do you need a token? Private
router.post('/', [ auth , [
    check('text', 'Text is required').not().isEmpty()
    ]
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        //token is inside req.user.id
        //to not send password back '-password"
    
        const newPost = new Post ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })

        //when you send back the post, will get it back in the response
        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
}
)

//route: GET api/posts
//description: fetch all posts
//private
router.get('/', auth, async (req, res) => {
    try {
        //getting all posts most recent first
       const posts = await Post.find().sort({ date: -1 }); 
       res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//route = GET get single post by its id



module.exports = router;