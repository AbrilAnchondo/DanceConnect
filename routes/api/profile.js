const express = require('express');
//to use express router
const  router = express.Router();
const auth= require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

//before every route you want to add 3 things:

//@route = request type GET api/profile/me <- endpoint
//@description = get current user profile
//@access = private

//route to get logged in user's profile api/profile/me
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }
        res.json(profile);
    } catch (err) {
        console.err(error.message);
        res.status(500).send('Server Error')
    }
});

//@route - POST api/profile
//@descrition - Create or update user profile
//@access - Private
router.post('/', [
    auth, 
        [
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'Skills field is required')
            .not()
            .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    const {
        company,
        website,
        location,
        bio,
        status,
        youtubeusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //build profile obj to insert to db, first check to see if info is coming in...
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(youtubeusername) profileFields.youtubeusername = youtubeusername;
    if (skills) {
        console.log("checking...")
        profileFields.skills = skills.split(', ').map(skill => skill.trim());
    }
    //build social obj, 
    profileFields.social = {};  if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if(profile) {
            //Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields }, 
                { new: true }
            );
            return res.json(profile);
        }

        //create profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route = request type GET api/profile
//@description = get all profiles
//@access = public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route = request type GET api/profile/user/:user_id
//@description = get profile by user id
//@access = public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if(!profile) return res.status(400).json({ msg: 'Profile not found'});

        res.json(profile);
    }catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'})
        }
        res.status(500).send('Server error');
    }
});

//@route = request type DELETE api/profile
//@description = Delete profile, user&posts
//@access = private
router.delete('/', auth, async (req, res) => {
    try {
        //todo- remove user's post
        //remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'Deleted User' });
    }catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'})
        }
        res.status(500).send('Server error');
    }
});

//@route = request type PUT api/profile/experience
//@description = add profile experience
//@access = private
router.put('/experience', [auth, [
    check('title', 'Title is required')
    .not()
    .isEmpty(),
    check('company', 'Company is required')
    .not()
    .isEmpty(),
    check('from', 'From date is required')
    .not()
    .isEmpty()
]], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { 
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
       const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//could be a put request though...
//@route = request type DELETE api/profile/experience/:exp_id
//@description = Delete experience from profile
//@access = private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    }catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'})
        }
        res.status(500).send('Server error');
    }
});

//@route = request type PUT api/profile/education
//@description = add profile education
//@access = private
router.put('/education', [auth, [
    check('school', 'School is required')
    .not()
    .isEmpty(),
    check('field', 'Field is required')
    .not()
    .isEmpty(),
    check('from', 'From date is required')
    .not()
    .isEmpty()
]], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { 
        school,
        degree,
        field,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        field,
        from,
        to,
        current,
        description
    }

    try {
       const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


//@route = request type DELETE api/profile/education/:edu_id
//@description = Delete education from profile
//@access = private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    }catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'})
        }
        res.status(500).send('Server error');
    }
});

//whenever using a mongoose method we use await because it returns a promise
module.exports = router;