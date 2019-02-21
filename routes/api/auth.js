const express = require('express');
const moment = require('moment');
const otpGen = require('otp-generator');
const Sequelize = require('sequelize');
const { check, validationResult } = require('express-validator/check');
const { OtpRecord } = require('../../models/models');

const router = express.Router();

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
            const code = otpGen.generate(6, { alphabets: false, upperCase: false, specialChars: false });
            return OtpRecord.build({
                code: code,
                phoneNumber: phoneNumber,
                expireAt: moment().add(5, 'minute').format()
            }).save();
        }
    })
    .then(result => {
        res.send({
            'test_otp': result.code
        });
    })
    .catch(err => {
        res.status(400).json({ error: String(err) });
    });
});

module.exports = router;