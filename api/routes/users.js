const express = require('express'),
    router = express.Router(),
    config = require('config'),
    fs = require('file-system');

router.post('/api/users', (req, res) => {
    const data = JSON.parse(fs.readFileSync(config.get('jsonUsers'), 'utf8')),
        user = req.body;

    data.push(user);
    fs.writeFileSync(config.get('jsonUsers'), JSON.stringify(data));

    res.send(user);
});

module.exports = router;