const express = require('express')

const Router = express.Router()

var Crypto = require('../models/crypto');

var Polka = require('../models/polka')

const bodyParser = require('body-parser')

const { body, check, validationResult } = require('express-validator');

const jsonParser = bodyParser.json()

const IsAdmin = require('../middleware/IsAdmin')

const https = require('https');

const axios = require('axios')

// CREATE NEW TOKEN
Router.post('/', IsAdmin, jsonParser, [
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
        const crypto = new Crypto(payload)

        await crypto.save()

        res.status(201).json({ type: 'success', message: 'Token Added Successfully' });
    }
    catch (error) {

        res.status(422).json({ type: 'error', error: error, message: error.code === 11000 ? 'Token Already Exist' : error.message });
    }
})

// GET THE TOKEN
Router.get('/', async (req, res) => {
    try {
        let data = {}

        if (req.query.token)
            data = { crypto_token: { $regex: '.*' + req.query.token + '.*' } }

        console.log(data)

        const token = await Crypto.find(data)

        res.status(200).json({ type: "success", data: token });
    }
    catch (error) {
        res.status(422).json({ type: "error", message: error });
    }
})

// CHECK FOR THE VALID TOKEN
Router.post('/check', jsonParser, async (req, res) => {

    let data = { crypto_token: req.body.token }

    var token = await Crypto.findOne(data)

    if (token == null) {
        token = await Polka.findOne({ token: req.body.token })
    }

    const tokenInfo = await axios.get(`https://api.dirtyhash.com/query/${req.body.token}`);
    // const tokenInfo = await axios.get(`https://api.dirtyhash.com/query/15LmfYr1UwK9ghjn5cNYoBmApaiWGFNnhBdm6nQF87vY2AcV`);

    console.log(tokenInfo)

    if (token) {
        // let count = parseInt(token.transaction_times) + 1;

        // await Crypto.findByIdAndUpdate(token._id, { transaction_times: count })

        res.status(200).json({
            type: 'success',
            message: "Token is Valid",
            data: token,
            tokenInfo: tokenInfo.data
        });
    } else
        res.status(200).json({ type: 'error', message: "Token is not Valid" });

})

// DELETE THE TOKEN
Router.delete('/:tokenId', IsAdmin, async (req, res) => {

    try {
        const data = req.params.tokenId

        const report = await Crypto.findByIdAndDelete(data)

        res.status(200).json({ message: "Token Deleted Successfully" });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
})

// UPDATE THE TOKEN
Router.put('/:tokenId', IsAdmin, jsonParser, [
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
        const report = await Crypto.findByIdAndUpdate(data, payload)

        res.status(200).json({ type: "success", message: "Token Updated Successfully" });
    }
    catch (error) {
        res.status(422).json({ type: "error", error: error });
    }
})

// EDIT TOKEN
Router.get('/:tokenId/edit', IsAdmin, async (req, res) => {

    try {
        const data = req.params.tokenId

        const report = await Crypto.findById(data)

        res.status(200).json({ data: report });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
})

// UPDATE POLKADOT TOKENS
Router.get('/updatePolkaDotTokens', IsAdmin, async (req, res) => {

    const response = await axios.get('https://raw.githubusercontent.com/polkadot-js/phishing/master/address.json')

    const responseData = (response.data)

    let allKeys = Object.getOwnPropertyNames(responseData)

    var allTokens = []

    await Polka.remove({})

    allKeys.forEach((item) => {

        responseData[item].forEach((token) => {
            allTokens.push({ 'token': token })
        })

    })

    await Polka.insertMany(allTokens)

    res.status(200).json({ message: 'updated' })

});

// GET ALL POLKA TOKENS
Router.get('/polka-tokens', IsAdmin, async (req, res) => {

    const tokens = await Polka.find({})

    res.status(200).json({ data: tokens })

})

// modules export
module.exports = Router