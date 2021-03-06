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
    check('text', 'Text is required')
    .not()
    .isEmpty()
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
        res.status(500).send('Server Error');
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

//route = GET api/posts/:id
//description = Get post by its id
//private
router.get('/:id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).send({ msg: 'Post not found...'})
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);

        //to be more specific...if post is not found we should get the same error, if there isn't a valid ObjectId
        if (err.kind === 'ObjectId') {
           return  res.status(404).send({ msg: 'Post not found...'})
        }

        res.status(500).send('Server Error');
    }
    
})

// route DELETE api/posts/:id
// description: delete post by id
//private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send({ msg: 'Post not found...'})
        }

        //checking the user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).send({msg: 'User not authorized' })
        }

        await post.remove();
        res.json({ msg: 'Post removed'});

        if (!post) {
            return res.status(404).send({ msg: 'Post not found...' })
        }
        
    } catch (err) {
        console.error(err.message);

        // if there isn't a valid objectId
        if (err.kind === 'ObjectId') {
            return  res.status(404).send({ msg: 'Post not found...'})
         }

        res.status(500).send({ msg: 'Server error'});
    }
})

//route:  PUT api/posts/like/:id
//description: like a post
//access: private
router.put('/like/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        //check if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).send({ msg: 'Post has already been liked' })
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ msg: 'Server error'});
    }
})

//route PUT api/posts/unlike/:id
//description: unlike a post
//acces: private
router.put('/unlike/:id', auth, async (req,res) => {
    
    try {

        const post = await Post.findById(req.params.id);

        //check if post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).send({ msg: 'Post has not been liked' })
        }

        //get remove index, gets the correct like to remove
        const removeIndx = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);

        post.likes.splice(removeIndx, 1);
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ msg: 'Server error'})
        
    }
})

//@route = request type POST api/posts/comment/:id
//@description: create comment on post
//@access: Private
router.post('/comment/:id', [ auth , [
    check('text', 'Text is required')
    .not()
    .isEmpty()
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

        const post = await Post.findById(req.params.id);
    
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');
    }
})

//route DELETE api/posts/comment/:id/:comment_id
//description: delete a comment
//acces: private
router.delete('/comment/:id/:comment_id', auth, async (req,res) => {
    
    try {

        const post = await Post.findById(req.params.id);

        //get comment from the post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        //Make sure comment exitst
        if(!comment) {
            return res.status(404).send({ msg: 'Comment does not exist'})
        }

        //Check if user that is deleting the comment is the one logged in
        if(comment.user.toString() !== req.user.id) {
            return res.status(401).send({ msg: 'User is not authorized'})
        }

        //get indx of comment to be removed, gets the correct comment to remove
        const removeIndx = post.comments
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);

        post.comments.splice(removeIndx, 1);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ msg: 'Server error'})
        
    }
})




module.exports = router;