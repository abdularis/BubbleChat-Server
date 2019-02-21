const express = require('express');
const moment = require('moment');
const otpGen = require('otp-generator');
const Sequelize = require('sequelize');
const { check, validationResult } = require('express-validator/check');
const { OtpRecord } = require('../../models/models');

const router = express.Router();

const OTP_LENGTH = 6;

const signinValidator = [
    check('phone_num').exists()
];

router.post('/signin', signinValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const phoneNumber = req.body.phone_num;

    OtpRecord.findOne({
        where: {
            phoneNumber: phoneNumber,
            isUsed: false,
            expireAt: {
                [Sequelize.Op.gt]: new Date()
            }
        }
    })
    .then(result => {
        if (result) {
            throw new Error("OTP request is already requested.");
        } else {
            const code = otpGen.generate(OTP_LENGTH, { alphabets: false, upperCase: false, specialChars: false });
            return OtpRecord.build({
                code: code,
                phoneNumber: phoneNumber,
                expireAt: moment().add(5, 'minute').format()
            }).save();
        }
    })
    .then(result => {
        res.send({
            'expire': result.expireAt,
            'test_otp': result.code
        });
    })
    .catch(err => {
        res.status(400).json({ error: String(err) });
    });
});


const verifyOtpValidator = [
    check('code').exists().isLength(OTP_LENGTH),
    check('phone_num').exists()
]

router.post('/verifycode', verifyOtpValidator, (req, res) => {
    const phoneNumber = req.body.phone_num;
    const code = req.body.code;

    OtpRecord.findOne({
        where: {
            phoneNumber: phoneNumber,
            isUsed: false,
            code: code,
            expireAt: {
                [Sequelize.Op.gt]: new Date()
            }
        }
    })
    .then(result => {
        console.log(result);
        if (result) {
            return OtpRecord.update({
                isUsed: true
            }, {
                where: {
                    id: result.id
                }
            });
        } else {
            throw new Error("Failed to verify OTP, expire or invalid code");
        }
    })
    .then(result => {
        if (result) {
            res.send({
                "status": "success"
            });
        }
    })
    .catch(err => {
        res.status(400).json({ error: String(err) });
    });
});


module.exports = router;