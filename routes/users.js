const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('config');
const jwtSecretKey = config.get('jwtSecretKey');
const { check, validationResult } = require('express-validator');
const UserModel = require("../model/user")



//post  => register user
router.post('/register', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'valid email is required').isEmail(),
    check('password', 'min length is 6 and max length is 8').isLength({ min: 6, max: 8 })

], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        //user exist
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: "User already exist" }] })
        }

        user = new UserModel({
            name,
            email,
            password
        })

        //encrypt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        //tokern return
        let data = {
            email: user.email,
            name: user.name,
            userId: user._id
        }
        jwt.sign(data, jwtSecretKey, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
        // res.send(user);
    } catch (error) {
        console.log(error);
    }
})



//post  => login user
router.post('/login', [
    check('email', 'valid email is required').isEmail(),
    check('password', 'min length is 6 and max length is 8').isLength({ min: 6, max: 8 })

], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    const { email, password } = req.body;
    try {
        //user exist
        let user = await UserModel.findOne({ email });
        if (user) {
            const dataBasepassword = user.password;
            bcrypt.compare(password, dataBasepassword, (err, result) => {
                if (err) throw err;
                if (!result) {
                    return res.send("Incorrect password");
                }
                return res.json({ user });
            });
        }

        // return res.status(400).json({ errors: [{ msg: "User already exist" }] })

        // user = new UserModel({
        //     name,
        //     email,
        //     password
        // })

        //encrypt
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(password, salt);
        // await user.save();

        //tokern return
        // let data = {
        //     email: user.email,
        //     name: user.name,
        //     userId: user._id
        // }
        // const token = jwt.sign(data, jwtSecretKey);

        // res.send(token);
        // res.send(user);
    } catch (error) {
        console.log(error);
    }
})







//get =>getallusers
router.get('/', async (req, res) => {
    try {
        const users = await UserModel.find();
        res.send(users)

    } catch (error) {
        console.log(error)
    }
})

module.exports = router;