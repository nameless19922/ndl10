const mongodb   = require('mongodb');
const inspector = require('schema-inspector');
const db        = require('../db');

const sanitization = {
    type: 'object',

    properties: {
        firstname:  { type: 'string', rules: ['trim'] },
        lastname:   { type: 'string', rules: ['trim'] },
        phone:      { type: 'string', rules: ['trim'] },
        additional: { type: 'string', rules: ['trim'] }
    }
};

const validation = {
    type: 'object',

    properties: {
        firstname: { type: 'string',  minLength: 6 },
        lastname:  { type: 'string',  minLength: 6 },
        phone:     { type: 'string',  minLength: 6, pattern: /^\+7 \d{3} \d{3} \d{4}$/ }
    }
};

module.exports = {
    all: (params) => {
        const paramSanitazion = {
            type: 'object',

            properties: {
                query: { type: 'string', rules: ['trim'] },
                field: { type: 'string', rules: ['trim'] }
            }
        };
        const paramValidation = {
            type: 'object',

            properties: {
                query: { type: 'string' },
                field: { type: 'string' }
            }
        };

        inspector.sanitize(paramSanitazion, params);

        const result = inspector.validate(paramValidation, params);

        let   search = result.valid ? { [params.field]: new RegExp(params.query, 'i') }  : {};

        return db.get().collection('contacts').find(search).sort( { _id: -1 } ).toArray();
    },

    get: id => {
        const length = 24;

        return id.length === length ?
            db.get().collection('contacts').findOne({ _id: new mongodb.ObjectID(id) }) :
                Promise.reject('Invalid id');
    },

    add: contact => {
        inspector.sanitize(sanitization, contact);

        const result = inspector.validate(validation, contact);

        return result.valid ? db.get().collection('contacts').insert(contact) : Promise.reject(result.format());
    },

    update: (id, contact) => {
        inspector.sanitize(sanitization, contact);

        const length = 24;
        const result = inspector.validate(validation, contact);

        if (id.length === length) {
            if (result.valid) {
                return db.get().collection('contacts').updateOne(
                    { _id: new mongodb.ObjectID(id) },
                    { $set: contact }
                );
            } else {
                return Promise.reject(result.format());
            }
        } else {
            return Promise.reject('Invalid id');
        }

    },

    remove: id => {
        const length = 24;

        return id.length === length ?
            db.get().collection('contacts').remove({ _id: new mongodb.ObjectID(id) }, true) :
                Promise.reject('Invalid id');
    }
}