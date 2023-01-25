const express = require('express')

const Router = express.Router()

const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()

const { body, check, validationResult } = require('express-validator');

const Admin = require('../models/admin')

const jwt = require('jsonwebtoken')


Router.post('/login', jsonParser, [
    check('username').not().isEmpty().withMessage("Username is Required").trim(),

    check('password').not().isEmpty().withMessage("Password is Required").trim(),

], async (req, res) => {

    const errors = validationResult(req).formatWith(({ msg }) => msg);

    const hasError = !errors.isEmpty()

    if (hasError) {
        res.status(422).json({ type: 'error', message: errors.array() });
        return false
    }

    let admin = await Admin.findOne({ username: req.body.username });

    if (!admin) return res.status(400).send('Invalid username or password.');

    try {
        const validPassword = await bcrypt.compare(req.body.password, admin.password);

        if (!validPassword) return res.status(400).send('Invalid email or password.');

    } catch (ex) {
        console.log(ex);
    };

    var X_TOKEN = jwt.sign({
        admin: admin
    }, process.env.JWT_SECRET, {
        expiresIn: 86400
    });

    res.status(200).send({ token: X_TOKEN });

})

module.exports = Router