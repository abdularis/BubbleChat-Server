const express = require('express');
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

    OtpRecord.build({
        phoneNumber: req.body.phone_num
    }).save();
    res.send({
        'token': "jwt-token-here"
    });
});

module.exports = router;