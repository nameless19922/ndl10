const mongoClient = require('mongodb').MongoClient;

let state = {
    db: null
};

module.exports = {
    connect(url)  {
        return new Promise((resolve, reject) => {
            if (state.db) {
                resolve(true);
            }

            mongoClient.connect(url).then(db => {
                state.db = db;
                resolve(true);
            }).catch(error => {
                reject(error);
            });
        });
    },

    get() {
        return state.db;
    },

    close() {
        if (state.db) {
            state.db.close();
        }
    }
}