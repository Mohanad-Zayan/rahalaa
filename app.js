const express = require('express');
const morgan = require('morgan');

const AppError = require('./util/AppError');
const globalErrorHandlers = require('./controlles/errorController')

const userRouter = require('./routes/userRoutes');
const cityRouter = require('./routes/cityRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'DEV') {
  app.use(morgan('dev'));
}

// neccessary for parsing the body of the req 
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES index

app.use('/api/users', userRouter);
app.use('/city/:city', cityRouter);


app.all('*', (req, res ,next)=>{
  next(new AppError(`can't find ${req.originalUrl}!` , 404)) ; 
});

app.use(globalErrorHandlers)

module.exports = app;

