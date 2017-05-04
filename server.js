const express    = require('express');
const ejs        = require('ejs-locals');
const path       = require('path');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const logger     = require('./logger');

const config     = require('./config');
const db         = require('./db');

function handleErrors(code, res, status, errors) {
    res.status(code);
    res.json({
        response: {
            status,
            errors
        }
    });
}

module.exports = port => {
    const app = express();

    app.engine('ejs', ejs);

    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'ejs')

    app.use(express.static(path.join(__dirname, '/public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(morgan('combined', { "stream": logger.stream }));

    app.use(require('./controllers'));

    app.use((req, res, next) => {
        res.status(404)
            .render('404', {
                title: 'Page not found'
            });
    });

    app.use('/api', (err, req, res, next) => {
        handleErrors(
            200,
            res,
            0,
            err.message
        );
    });

    app.use(function(err, req, res, next){
        res.status(err.status || 500)
            .render('500', {
                title: 'Internal server error'
            });
    });

    db.connect(`${config.mongodb.defaultUri}/${config.mongodb.defaultDb}`).then(result => {
        if (result) {
            app.listen(port, () => {
                logger.info(`Start http server at ${port}`);
            });
        }
    }).catch(err => {
        logger.error(err.message);
        process.exit(1);
    });
}