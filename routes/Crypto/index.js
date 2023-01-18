const express = require('express')
const Router = express.Router()

const { body, check, validationResult } = require('express-validator');
const CryptoToken = require('../../models/CryptoToken');

// CREATE NEW TOKEN
Router.post('/', [
    check('crypto_token_name').not().isEmpty().withMessage("Token Name is Required").trim(),

    check('crypto_token').not().isEmpty().withMessage("Token is Required").trim(),

], async (req, res) => {

    const errors = validationResult(req).formatWith(({ msg }) => msg);

    const hasError = !errors.isEmpty()

    if (hasError) {
        res.status(422).json({ error: errors.array() });
    }

    const payload = {
        crypto_token_name: req.body.crypto_token_name,
        crypto_token: req.body.crypto_token,
    }

    try {
        const crypto = new CryptoToken(payload)

        await crypto.save()

        res.status(201).json({ type: 'success', message: 'Token Added Successfully' });
    }
    catch (error) {
        console.log(error.message)
        res.status(422).json({ type: 'error', error: error, message: error.message });
    }
})

// GET THE TOKEN
Router.get('/', async (req, res) => {
    try {
        let data = {}

        if (req.query.token)
            data = { crypto_token: { $regex: '.*' + req.query.token + '.*' } }

        console.log(data)

        const token = await CryptoToken.find(data)

        res.status(200).json({ type: "success", data: token });
    }
    catch (error) {
        res.status(422).json({ type: "error", message: error });
    }
})

// CHECK FOR THE VALID TOKEN
Router.post('/check', async (req, res) => {

    let data = { crypto_token: req.body.token }

    const token = await CryptoToken.findOne(data)

    if (token)
        res.status(200).json({ type: 'success', message: "Token is Valid", data: token });
    else
        res.status(200).json({ type: 'error', message: "Token is not Valid" });

})

// DELETE THE TOKEN
Router.delete('/:tokenId', async (req, res) => {

    try {
        const data = req.params.tokenId

        const report = await CryptoToken.findByIdAndDelete(data)

        res.status(200).json({ message: "Token DeletedF Successfully" });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
})

// UPDATE THE TOKEN
Router.put('/:tokenId', [
    check('crypto_token_name').not().isEmpty().withMessage("Token Name is Required").trim(),

    check('crypto_token').not().isEmpty().withMessage("Token is Required").trim(),

], async (req, res) => {

    const errors = validationResult(req).formatWith(({ msg }) => msg);

    const hasError = !errors.isEmpty()

    if (hasError) {
        res.status(422).json({ error: errors.array() });
    }

    const payload = {
        crypto_token_name: req.body.crypto_token_name,
        crypto_token: req.body.crypto_token,
    }

    const data = req.params.tokenId

    try {
        const report = await CryptoToken.findByIdAndUpdate(data, payload)

        res.status(200).json({ type: "success", message: "Token Updated Successfully" });
    }
    catch (error) {
        res.status(422).json({ type: "error", error: error });
    }
})

// EDIT TOKEN
Router.get('/:tokenId/edit', async (req, res) => {

    try {
        const data = req.params.tokenId

        const report = await CryptoToken.findById(data)

        res.status(200).json({ data: report });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
})

module.exports = Router