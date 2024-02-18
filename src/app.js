const createError = require('http-errors');
const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const indexRouter = require('./routes/index');
const aliveRouter = require('./routes/alive');
const cardRouter = require('./routes/card');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', indexRouter);

// alive endpoint
app.use('/alive', aliveRouter);

// card endpoint
app.use('/card/:cardId', basicAuth({
	users: {
		'admin': 'supersecret'
	},
	challenge: true
}), (req, res, next) => {
	req.config = { cardId: req.params.cardId };
	next();
}, cardRouter.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
