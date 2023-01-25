const express = require('express')
const Router = express.Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const { body, check, validationResult } = require('express-validator');

var NewsLetter = require('../models/newsletter')
const IsAdmin = require('../middleware/IsAdmin')

// SIGN UP FOR NEWSLETTER
Router.post('/', jsonParser, [

    check('email').not().isEmpty().withMessage("Email is Required").trim(),

], async (req, res) => {

    const errors = validationResult(req).formatWith(({ msg }) => msg);

    const hasError = !errors.isEmpty()

    if (hasError) {
        res.json({ type: 'error', message: errors.array() });
        return false
    }

    const payload = {
        email: req.body.email,
    }

    try {
        const letter = await new NewsLetter(payload)

        letter.save()

        res.json({ type: 'success', message: 'News Letter Subscribed' });
    }
    catch (error) {
        res.json({ type: 'error', message: error });
        return false
    }
})

//  GET ALL NEWS LETTER RECIPENTS
Router.get('/', IsAdmin, async (req, res) => {
    try {
        let data = {}

        if (req.query.token)
            data = { crypto_token: { $regex: '.*' + req.query.token + '.*' } }

        const letters = await NewsLetter.find(data)

        res.status(201).json({ type: 'success', data: letters });
    }
    catch (error) {
        res.status(422).json({ type: 'error', message: error });
    }
})

// DELETE NEWS LETTER RECIPENT
Router.delete('/:newsLetterID', IsAdmin, async (req, res) => {

    try {
        const data = req.params.newsLetterID

        const report = await NewsLetter.findByIdAndDelete(data)

        res.status(200).json({ message: "Recipent Deleted Successfully" });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
})

module.exports = Router