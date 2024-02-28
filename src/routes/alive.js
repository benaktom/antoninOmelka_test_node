const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	// [CR] v dokumentaci se píše, že vrátí application/json, ale reálně vrátí text/html
	res.send('OK');
});

module.exports = router;
