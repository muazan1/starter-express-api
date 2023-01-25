const express = require('express')
const Router = express.Router()

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const { check, validationResult } = require('express-validator');

var nodemailer = require('nodemailer')
var User = require('../models/user')
var Crypto = require('../models/crypto')

const IsAuth = require('../middleware/IsAuth')



// GET ALL REPORTS
Router.get('/', async (req, res) => {

    try {
        const users = await User.find()

        res.status(200).json({ data: users });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});


// DELETE THE REPORT
// Router.delete('/:reportId', async (req, res) => {

//     try {
//         const data = req.params.reportId

//         const report = await Report.findByIdAndDelete(data)

//         res.status(200).json({ message: "Report Deleted Successfully" });
//     }
//     catch (error) {
//         res.status(422).json({ error: error });
//     }
// });


module.exports = Router