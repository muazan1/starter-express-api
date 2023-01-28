const express = require('express')

const Router = express.Router()

const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()

const { check, validationResult } = require('express-validator');

var nodemailer = require('nodemailer')

var User = require('../models/user')

var Crypto = require('../models/crypto')

const IsAuth = require('../middleware/IsAuth')

const IsAdmin = require('../middleware/IsAdmin')

const Admin = require('../models/admin')

const bcrypt = require('bcryptjs')

// GET ALL REPORTS
Router.get('/', IsAdmin, async (req, res) => {

    try {
        const users = await Admin.find()

        res.status(200).json({ data: users });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});


// DELETE THE USER
Router.delete('/:userId', async (req, res) => {

    try {
        const data = req.params.userId

        const report = await Admin.findByIdAndDelete(data)

        res.status(200).json({ message: "User Deleted Successfully" });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});


// UPDATE THE USER
Router.put('/:userId', IsAdmin, jsonParser, [

    check('username').not().isEmpty().withMessage("Username is Required").trim(),

    check('email').not().isEmpty().withMessage("Email is Required").trim(),

], async (req, res) => {

    const errors = validationResult(req).formatWith(({ msg }) => msg);

    const hasError = !errors.isEmpty()

    if (hasError) {
        res.status(422).json({ error: errors.array() });
    }

    const user = await Admin.findById(req.params.userId);

    var hashedPassword = '';

    if (req.body.password != '') {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
    } else {
        hashedPassword = user.password
    }

    const payload = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    }

    const data = req.params.userId

    try {
        const admin = await Admin.findByIdAndUpdate(data, payload)

        res.status(200).json({ type: 'success', message: "User Updated Successfully" });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});

// CREATE NEW SYSTEM USER
Router.post('/', IsAdmin, jsonParser, [

    check('username').not().isEmpty().withMessage("Username is Required").trim(),

    check('email').not().isEmpty().withMessage("Email is Required").trim(),

    check('password').not().isEmpty().withMessage("Password is Required").trim(),

], async (req, res) => {

    const errors = validationResult(req).formatWith(({ msg }) => msg);

    const hasError = !errors.isEmpty()

    if (hasError) {
        res.status(422).json({ error: errors.array() });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const payload = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    }

    try {
        const admin = await new Admin(payload)

        admin.save();

        res.status(200).json({ type: 'success', message: "User Created Successfully" });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});


module.exports = Router