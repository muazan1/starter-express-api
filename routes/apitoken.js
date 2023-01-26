const express = require('express')
const Router = express.Router()

const IsAuth = require('../middleware/IsAuth')

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const ApiToken = require('../models/apitoken')


const { check, validationResult } = require('express-validator');
const IsAdmin = require('../middleware/IsAdmin')

// GENERATING API TOKEN
Router.post('/', IsAuth, jsonParser, [

    check('token_name').not().isEmpty().withMessage("Token Name is Required").trim(),

], async (req, res) => {

    const errors = validationResult(req).formatWith(({ msg }) => msg);

    const hasError = !errors.isEmpty()

    if (hasError) {
        res.status(200).json({ type: 'error', message: errors.array() });
        return false
    }

    const token = generateString(48);

    const userToken = await ApiToken.findOne({ 'user_id': req.user.user[0]._id })

    if (userToken !== null) {
        res.status(200).json({ type: 'error', message: ['Token Already Generated'] });
        return false
    }

    const payload = {
        user_id: req.user.user[0]._id,
        token_name: req.body.token_name,
        token: token,
    }

    try {
        const token = await new ApiToken(payload)

        token.save()

        res.status(201).json({ type: 'success', message: 'Api Token Generated' });
    }
    catch (error) {
        res.status(422).json({ type: 'error', message: error });
    }

})


// MY API TOKEN
Router.delete('/my-token', IsAuth, async (req, res) => {

    const userToken = await ApiToken.findOneAndDelete({ 'user_id': req.user.user[0]._id })

    res.status(200).json({ type: 'success', message: 'Deleted' });
})

Router.get('/my-token', IsAuth, async (req, res) => {

    const userToken = await ApiToken.findOne({ 'user_id': req.user.user[0]._id })

    res.status(200).json({ type: 'success', data: userToken });
})

Router.get('/', IsAdmin, async (req, res) => {

    const userToken = await ApiToken.find({}).populate('user_id')

    res.status(200).json({ type: 'success', data: userToken });
})

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

module.exports = Router