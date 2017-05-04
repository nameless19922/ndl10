const mongoClient = require('mongodb').MongoClient;

let state = {
    db: null
};

module.exports = {
    connect: (url, done) => {
        if (state.db) {
            return done();
        }

        mongoClient.connect(url, (err, db) => {
            if (err) {
                return done(err)
            }

            state.db = db;
            done();
        })
    },

    get: () => {
        return state.db;
    },

    close: () => {
        if (state.db) {
            state.db.close((err, result) => {
                state.db = null;
                state.mode = null;
                done(err);
            })
        }
    }
}