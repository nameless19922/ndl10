const cwd      = process.cwd();
const express  = require('express');
const path     = require('path');
const router   = express.Router();
const Contacts = require(path.join(cwd, './models/contacts'));

router.get('/', (req, res) => {
   res.render('contacts', {
      title: 'Contact list'
   });
});

router.get('/id/:id', (req, res) => {
    Contacts.get(req.params.id).then(result => {
        if (result) {
            res.render('contacts-item', {
                title: 'Contact',
                result
            });
        } else {
            res.redirect('/contracts');
        }
    }).catch(errors => {
        res.redirect('/contacts');
    });
});

router.get('/edit/:id', (req, res) => {
    Contacts.get(req.params.id).then(result => {
        if (result) {
            res.render('contacts-edit', {
                title: 'Contact',
                result
            });
        } else {
            res.redirect('/contracts');
        }
    }).catch(errors => {
        res.redirect('/contacts');
    });
});

router.get('/add', (req, res) => {
    res.render('contacts-add', {
       title: 'Add a new contact'
    });
});

module.exports = router;
