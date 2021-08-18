const router = require('express').Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')
    //UPDATE USER
router.put('/:id', async(req, res) => {
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            //UPDATING THE USER PASSWORD
            if (req.body.password) {
                try {
                    const salt = await bcrypt.gensalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt)
                } catch (err) {
                    return res.status(500).json(err)
                }
            }
            //UPDATING THE USER DETAILS
            try {
                const user = await User.findByIdAndUpdate(req.body.userId, { $set: req.body, })
                res.status(200).json('account updated successfully')
            } catch (err) {
                return res.status(500).json(err)
            }
        } else { return res.status(403).json('you can only update your account') }
    })
    //delete user
router.delete('/:id', async(req, res) => {
        if (req.body.userId === req.params.id || req.body.isAdmin) {

            //deleting THE USER DETAILS
            try {
                const user = await User.findByIdAndDelete(req.body.userId)
                res.status(200).json('account deleted successfully')
            } catch (err) {
                return res.status(500).json(err)
            }
        } else { return res.status(403).json('you can only delete your account') }
    })
    //get user
router.get('/:id', (req, res) => {
        try {
            const user = await User.findById(req.body.userId);
            const { passwor, updatedAt, ...other } = user._doc
            res.status(200).json(other)
        } catch (err) {
            return res.status(500).json(err)
        }
    })
    //follow user
router.put('/:id/follow', async(req, res) => {
        if (req.body.userId !== req.params.id) {

            //following other USER
            try {
                const user = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.userId);
                if (!user.followers.includes(req.body.userId)) {
                    await User.updateOne({
                        $push: { followers: req.body.userId }
                    });
                    await currentUser.updateOne({
                        $push: { followings: req.body.userId }
                    });
                    res.status(200).json('user has been followed')
                } else {
                    res.status(403).json('you already follow this user')
                }
            } catch (err) {
                return res.status(500).json(err)
            }
        } else { return res.status(403).json('you cannot follow yourself') }
    })
    //unfollow  user
router.put('/:id/unfollow', async(req, res) => {
    if (req.body.userId !== req.params.id) {

        //unfollowing aUSER
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await User.updateOne({
                    $pull: { followers: req.body.userId }
                });
                await currentUser.updateOne({
                    $pull: { followings: req.body.userId }
                });
                res.status(200).json('user has been unfollowed')
            } else {
                res.status(403).json('you already unfollowed this user')
            }
        } catch (err) {
            return res.status(500).json(err)
        }
    } else { return res.status(403).json('you cannot unfollow yourself') }
})

module.exports = router