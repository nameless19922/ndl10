const express     = require('express');
const ejs         = require('ejs-locals');
const path        = require('path');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');

const config      = require('./config');
const db          = require('./db');

module.exports = port => {
    const app = express();

    app.engine('ejs', ejs);

    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'ejs')

    app.use(express.static(path.join(__dirname, '/public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(morgan(':date[clf] :method :url :status - :response-time ms'));

    app.use(require('./controllers'));


    app.use('/api', (err, req, res, next) => {
        console.log(err.stack);
    });

    app.use((req, res, next) => {
        res.status(404)
            .render('404', {
                title: 'Страница не найдена'
            });
    });

    app.use((err, req, res, next) => {
        if (res.headersSent) {
            return next(err);
        }

        res.status(500)
            .render('500', {
                title: 'Внутрення ошибка сервера'
            });
    });

    db.connect(`${config.mongodb.defaultUri}/${config.mongodb.defaultDb}`, (err) =>{
        if (err) {
            console.error('Unable to connect to Mongodb.')
            process.exit(1)
        } else {
            app.listen(port, () => {
                console.log(`Start http server at ${port}`);
            });
        }
    });
}