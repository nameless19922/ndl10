const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
   res.render('contacts', {
      title: 'Contact list'
   });
});

router.get('/add', (req, res) => {
    res.render('contacts-add', {
       title: 'Add a new contact'
    });
});

module.exports = router;