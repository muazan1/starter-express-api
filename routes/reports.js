const express = require('express')
const Router = express.Router()

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const { check, validationResult } = require('express-validator');

var nodemailer = require('nodemailer')
var Report = require('../models/report')
var Crypto = require('../models/crypto')
var User = require('../models/user')

const IsAuth = require('../middleware/IsAuth')

const IsAdmin = require('../middleware/IsAdmin')


// CREATE NEW REPORT
Router.post('/', IsAuth, jsonParser, [

    check('scam_type').not().isEmpty().withMessage("Please Select Scam Type").trim(),

    check('bcp_address').not().isEmpty().withMessage("BCP Address is Required").trim(),

    check('description').not().isEmpty().withMessage("Description is Required").trim(),

], async (req, res) => {

    const errors = validationResult(req).formatWith(({ msg }) => msg);

    const hasError = !errors.isEmpty()

    if (hasError) {
        res.status(422).json({ type: 'error', message: errors.array() });
        return false
    }

    // const token = await Crypto.findOne({ crypto_token: req.body.bcp_address });

    // if (token != null) {
    //     let count = parseInt(token.reported_times) + 1

    //     await Crypto.findOneAndUpdate({ crypto_token: req.body.bcp_address }, { reported_times: count });
    // }
    //  else {
    //     res.json({ type: 'error', message: ['Invalid Token'] });

    //     return false
    // }

    // const payload = {
    //     user_id: req.user.user[0]._id,
    //     scam_type: req.body.scam_type,
    //     bcp_address: req.body.bcp_address,
    //     description: req.body.description,
    //     token: token._id
    // }

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASSWORD
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
        to: `${req.user.user[0].email}`,
        subject: 'Your Report has been Submitted',
        text: 'Hello, We Recived your report ',
        html: `<div style="background-color:#191a1c;margin:0;padding:3%;width:100%">
                <table border="0" cellpadding="0" cellspacing="0" height="100%" class="m_-505009148846401985wrapper-table"
                    style="margin:auto;max-width:550px;width:100%;background-color: #232529;">
                    <tbody>
                        <tr>
                            <td align="center" valign="top">
                                <div id="m_-505009148846401985template_header_image" style="width:100%"> </div>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                    id="m_-505009148846401985template_container">
                                    <tbody>
                                        <tr>
                                            <td align="center" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                                    id="m_-505009148846401985template_header"
                                                    style="color:#ffffff;border-bottom:0;font-weight:bold;line-height:100%;vertical-align:middle;font-family:Arial,Helvetica,sans-serif">
                                                    <tbody>
                                                        <tr>
                                                            <td id="m_-505009148846401985header_wrapper"
                                                                style="padding:22px 24px;display:block; text-align: center;margin-top: 15px;">
                                                                <img style="height: 40px; text-align: center;"
                                                                    src="https://i.ibb.co/8dV4ZSq/download.png" alt="Logo">
                                                                <div
                                                                    style="background: linear-gradient(0deg, #40b6ff, #01ecf8);height: 1px;width: 80%;margin: 20px auto 0 auto;">
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                                    id="m_-505009148846401985template_body">
                                                    <tbody>
                                                        <tr>
                                                            <td valign="top" id="m_-505009148846401985body_content">
                                                                <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td valign="top" style="padding:0px 27px 27px 27px">
                                                                                <div id="m_-505009148846401985body_content_inner"
                                                                                    style="width:80%;margin:0 auto;color:#66696d;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:150%;text-align:left">
                                                                                    <p style="margin: 0;font-size: 17px;">Hello ${req.user.user[0].name},</p>
                                                                                    <p style="margin-top: -5px;font-size: 17px;">
                                                                                        We have recieved your Report.
                                                                                    </p>
                                                                                    <p style="margin-top: -17px;font-size: 17px;">
                                                                                        Thank You.                                                               
                                                                                    </p>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                        
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });

    try {
        // const report = await new Report(payload)

        // report.save()

        res.status(201).json({ type: 'success', message: 'Report Submitted Successfully' });
    }
    catch (error) {
        res.status(422).json({ type: 'error', message: error });
    }
});

// GET ALL REPORTS
Router.get('/', IsAdmin, async (req, res) => {

    try {
        const reports = await Report.find()
            .populate('user_id')
            .populate('token')

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
        const userCount = await User.find({}).count();

        res.status(200).json({ data: reports, reportCount: reportCount, userCount: userCount });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});

// GET SPECIFIC USER REPORTS
Router.get('/my-reports', IsAuth, async (req, res) => {

    try {
        let data = { user_id: req.user.user[0]._id }

        const reports = await Report.find(data).populate('token')

        res.status(200).json({ data: reports });
    }
    catch (error) {
        res.status(422).json({ error: error });
    }
});

// DELETE THE REPORT
Router.delete('/:reportId', IsAdmin, async (req, res) => {

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
Router.get('/:reportId/edit', IsAdmin, async (req, res) => {

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
Router.put('/:reportId', IsAdmin, jsonParser, [
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