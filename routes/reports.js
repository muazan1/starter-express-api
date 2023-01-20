const express = require('express')
const Router = express.Router()

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const { check, validationResult } = require('express-validator');

var nodemailer = require('nodemailer')
var Report = require('../models/report')
var Crypto = require('../models/crypto')

// CREATE NEW REPORT
Router.post('/', jsonParser, [
    check('user_id').not().isEmpty().withMessage("Some Went Wrong").trim(),

    check('scam_type').not().isEmpty().withMessage("Please Select Scam Type").trim(),

    check('bcp_address').not().isEmpty().withMessage("BCP Address is Required").trim(),

    check('description').not().isEmpty().withMessage("Description is Required").trim(),

], async (req, res) => {

    const errors = validationResult(req).formatWith(({ msg }) => msg);

    const hasError = !errors.isEmpty()

    if (hasError) {
        res.json({ type: 'error', message: errors.array() });
        return false
    }

    const token = await Crypto.findOne({ crypto_token: req.body.bcp_address });

    if (token != null) {
        let count = parseInt(token.reported_times) + 1

        await Crypto.findOneAndUpdate({ crypto_token: req.body.bcp_address }, { reported_times: count });
    } else {
        res.json({ type: 'error', message: ['Invalid Token'] });

        return false
    }

    const payload = {
        user_id: req.body.user_id || 454544668,
        scam_type: req.body.scam_type,
        bcp_address: req.body.bcp_address,
        description: req.body.description,
        token: token._id
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "4011bd5e658710",
            pass: "fa3c51cf80ff5a"
        }
    });

    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('Server is ready to take our messages');
        }
    });

    var mailOptions = {
        from: '"Wisesama" <admin@admin.com>',
        to: 'user1@user.com, user@admin.com',
        subject: 'Your Report has been Submitted',
        text: 'Hello, We Recived your report ',
        html: '<b>Hey there! </b><br> We Recieved your Report'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });

    try {
        const report = await new Report(payload)

        report.save()

        res.status(201).json({ type: 'success', message: 'Report Submitted Successfully' });
    }
    catch (error) {
        res.status(422).json({ type: 'error', message: error });
    }
});

// GET ALL REPORTS
Router.get('/', async (req, res) => {

    try {
        const reports = await Report.find().populate('token')

        res.status(200).json({ data: reports });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});

// GET LATEST REPORTS
Router.get('/latest', async (req, res) => {

    try {
        let data = {}

        const reports = await Report.find(data).limit(5).populate('token')

        const reportCount = await Report.find({}).count();

        res.status(200).json({ data: reports, reportCount: reportCount });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});

// GET SPECIFIC USER REPORTS
Router.get('/:userId', async (req, res) => {

    try {
        let data = { user_id: req.params.userId }

        const reports = await Report.find(data).populate('token')


        res.status(200).json({ data: reports });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});

// DELETE THE REPORT
Router.delete('/:reportId', async (req, res) => {

    try {
        const data = req.params.reportId

        const report = await Report.findByIdAndDelete(data)

        res.status(200).json({ message: "Report Deleted Successfully" });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});

// EDIT THE REPORT
Router.get('/:reportId/edit', async (req, res) => {

    try {
        const data = req.params.reportId

        const report = await Report.findById(data)

        res.status(200).json({ data: report });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});

// UPDATE THE REPORT
Router.put('/:reportId', jsonParser, [
    check('user_id').not().isEmpty().withMessage("Some Went Wrong").trim(),

    check('scam_type').not().isEmpty().withMessage("Please Select Scam Type").trim(),

    check('bcp_address').not().isEmpty().withMessage("BCP Address is Required").trim(),

    check('description').not().isEmpty().withMessage("Description is Required").trim(),

], async (req, res) => {

    const errors = validationResult(req).formatWith(({ msg }) => msg);

    const hasError = !errors.isEmpty()

    if (hasError) {
        res.status(422).json({ error: errors.array() });
    }

    const payload = {
        user_id: req.body.user_id,
        scam_type: req.body.scam_type,
        bcp_address: req.body.bcp_address,
        description: req.body.description,
    }

    const data = req.params.reportId

    try {
        const report = await Report.findByIdAndUpdate(data, payload)

        res.status(200).json({ message: "Report Updated Successfully" });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});

module.exports = Router