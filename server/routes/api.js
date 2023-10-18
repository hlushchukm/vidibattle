const express = require('express');
const router = express.Router();
router.get('/', (req, res, next) => {
    res.send("test works")
});

router.get('/test/:id', (req, res, next) => {
    res.send("test/id works")
});
module.exports = router;