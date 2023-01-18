const express = require('express')
const Router = express.Router()

const { body, check, validationResult } = require('express-validator');

const NewsLetter = require('../../models/NewsLetter')

// SIGN UP FOR NEWSLETTER
Router.post('/', [
    check('email').not().isEmpty().withMessage("Email is Required").trim(),

], async (req, res) => {

    const errors = validationResult(req).formatWith(({ msg }) => msg);

    const hasError = !errors.isEmpty()

    if (hasError) {
        res.status(422).json({ error: errors.array() });
    }

    const payload = {
        email: req.body.email,
    }

    try {
        const letter = await new NewsLetter(payload)

        letter.save()

        res.status(201).json({ type: 'success', message: 'News Letter Subscribed' });
    }
    catch (error) {
        res.status(422).json({ type: 'error', message: error });
    }
})

//  GET ALL NEWS LETTER RECIPENTS
Router.get('/', async (req, res) => {
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
Router.delete('/:newsLetterID', async (req, res) => {

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