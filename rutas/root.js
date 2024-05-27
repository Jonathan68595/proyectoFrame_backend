const express = require ('express');
const router = express.Router();
const path = require('path');
//para el index en html (despues)
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'vistas', 'index.html'))
})

module.exports = router;