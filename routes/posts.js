const express = require('express');
const router = express.Router();

router.get('/posts', (req, res, next) => {
    res.send('Hello from posts');
})

module.exports = router;