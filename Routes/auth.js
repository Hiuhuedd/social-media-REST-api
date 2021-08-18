const router = require('express').Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')


//REGISTER USER 
router.post('/register', async(req, res) => {
    try {
        //encrypting the users password
        const salt = await bcrypt.gensalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
            //INSTANTIATING A new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        //save user to MONGODB and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch {
        console.log('errora found');
    }
});
//LOGIN
router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json('user not found');
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json('wrong password');
        res.json('user')
    } catch (err) {
        console.log(err);
    }
})



module.exports = router