const express = require('express');
const { OtpRecord } = require('../../models/models');

const router = express.Router();

router.post('/signin', (req, res) => {
    OtpRecord.build({
        phoneNumber: "6281221484831"
    }).save();
    res.send({
        'token': "jwt-token-here"
    });
});

module.exports = router;