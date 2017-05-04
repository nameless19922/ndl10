const mongodb   = require('mongodb');
const inspector = require('schema-inspector');
const db        = require('../db');

const sanitization = {
    type: 'object',

    properties: {
        firstname: { type: 'string', rules: ['trim', 'title'] },
        lastname:  { type: 'string', rules: ['trim', 'title'] },
        phone:     { type: 'string', rules: ['trim'] }
    }
};

const validation = {
    type: 'object',

    properties: {
        firstname: { type: 'string', minLength: 6 },
        lastname:  { type: 'string', minLength: 6 },
        phone:     { type: 'string', minLength: 6 }
    }
};

module.exports = {
    all: () => {
        return db.get().collection('contacts').find().toArray();
    },

    get: id => {

    },

    add: (contact) => {
        inspector.sanitize(sanitization, contact);

        const result = inspector.validate(validation, contact);

        return result.valid ? db.get().collection('contacts').insert(contact) : Promise.reject(result.format());
    },

    update: id => {

    },

    remove: id => {
        return db.get().collection('contacts').remove({ _id: new mongodb.ObjectID(id) });
    }
}