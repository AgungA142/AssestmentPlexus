const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();
require('./config/redis');


const errorHandler = require('./error-handler');
const router = require('./routes/index');
const swaggerSetup = require('./config/swagger')


const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static('public'));

swaggerSetup(app);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Plexus Studio Assessment API',
        version: '1.0.0',
        documentation: 'api/docs'
    });
});
app.use('/api', router);
app.use(errorHandler.notFound);
app.use(errorHandler.errorHandler);

module.exports = app;