const cwd      = process.cwd();
const express  = require('express');
const path     = require('path');
const router   = express.Router();
const Contacts = require(path.join(cwd, './models/contacts'));

function handleResult(res, result) {
    res.status(200);
    res.json({
        response: {
            count: result.length,
            contacts: result
        }
    });
}

function handleMessage(code, res, status, message) {
    res.status(code);
    res.json({
        response: {
            status,
            message
        }
    });
}

function handleErrors(code, res, status, errors) {
    res.status(code);
    res.json({
        response: {
            status,
            errors
        }
    });
}

router.get('/', (req, res) => {
    Contacts.all().then(result => {
        handleResult(res, result);
    });
});

router.post('/', (req, res) => {
    Contacts.add(req.body).then(result => {
        handleMessage(
            200,
            res,
            1,
            'Contact successfully created'
        );
    }).catch(errors => {
        handleErrors(
            200,
            res,
            0,
            errors
        );
    })
});

router.delete('/:id', (req, res) => {
    Contacts.remove(req.params.id).then(result => {
        handleMessage(
            200,
            res,
            1,
            'Contact successfully removed'
        )
    });
});

module.exports = router;