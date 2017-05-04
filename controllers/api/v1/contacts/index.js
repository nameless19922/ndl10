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
    let query = req.query;

    Contacts.all(query).then(result => {
        handleResult(res, result);
    });
});

router.get('/:id', (req, res) => {
    Contacts.get(req.params.id).then(result => {
        if (result) {
            handleResult(res, result);
        } else {
            handleErrors(
                200,
                res,
                0,
                'Invalid id'
            );
        }
    }).catch(errors => {
        handleErrors(
            200,
            res,
            0,
            errors
        );
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

router.put('/:id', (req, res) => {
    Contacts.update(req.params.id, req.body).then(result => {
        if (result) {
            handleMessage(
                200,
                res,
                1,
                'Contact successfully updated'
            );
        } else {
            handleErrors(
                200,
                res,
                0,
                'Invalid id'
            );
        }
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
        );
    });
});

module.exports = router;