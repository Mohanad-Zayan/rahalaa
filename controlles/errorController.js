const AppError = require('../util/AppError');
const handleValidaationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = 'invalid input data.' + errors.join('. ');
  return new AppError(message, 400);
};

const handleDublicateErrorDB = err => {
  const keyName = Object.keys(err.keyPattern)[0];

  return new AppError(
    ` The ${keyName}: ${
      err.keyValue[keyName]
    } is Dublicated please Choose Another`,
    400
  );
};
const handleCastErrorDB = err => {
  return new AppError(`invalid ${err.path}: ${err.value} `, 400);
};
const handleJWTError = () => {
  return new AppError(`invalid token please login again `, 401);
};
const handleJWTExpiredError = () => {
  return new AppError(`Token has expired please, login again`, 401);
};


const SendErrorDev = (err, res) => {

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });

};


const SendErrorProd = (err, res) => {
  if (err.isOperational) {
    console.log({err});
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error(`error`, err);
    res.status(500).json({
      status: 'fail',
      message: 'something went very wrong!!'
    });
  }
};

// make sure error has suitable format or appropriate for the enviroment  


module.exports = (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'DEV') {

    SendErrorDev(err, res);

  } else if (process.env.NODE_ENV === 'PROD') {

    let error = { ...err };
    if (err.code == 11000) error = handleDublicateErrorDB(error);
    if (err.name == 'CastError') error = handleCastErrorDB(error);
    if (err.name == 'ValidationError') error = handleValidaationErrorDB(error);
    if (err.name == 'JsonWebTokenError') error = handleJWTError();
    if (err.name == 'TokenExpiredError') error = handleJWTExpiredError();

    SendErrorProd(error, res);
  }
};
