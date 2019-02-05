const express = require('express');
const router = express.Router();

router.get('/signin', (req, res) => {
    res.send({
        'token': "jwt-token-here"
    });
});

module.exports = router;