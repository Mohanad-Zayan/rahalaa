const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const catcAsync = require('../util/catcAsync');
const AppError = require('../util/AppError');
const { promisify } = require('util');
const sendEmail = require('../util/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};


const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
exports.signup = catcAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
    
  });

  createAndSendToken(newUser, 201, res);
  
}); 

exports.login = catcAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(
      new AppError(
        'please Make sure that the email and password are provided!',
        400
      )
    );

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassowrd(password, user.password)))
    return next(
      new AppError('please Make sure the email or password are correct !', 401)
    );

  createAndSendToken(user, 201, res);
});

exports.protect = catcAsync(async (req, res, next) => {
  // 1) check if the token is present

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(
      new AppError(
        "you are not allowed to access this route please make sure you're logged in",
        401
      )
    );

  //  2) verfication token

  const userDecoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  //  3) get User
  const freshUser = await User.findById(userDecoded.id);
  if (!freshUser) {
    return next(
      new AppError('the User belonging to this token does not exist', 401)
    );
  }

  if (freshUser.changedPasswordAfter(userDecoded.iat))
    return next(
      new AppError(
        'the User password has recently changed password! please re login',
        401
      )
    );

  // grant access
  req.user = freshUser; 
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('this role not allowed to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgetPassword = catcAsync(async (req, res, next) => {
  // 1) get user based on the posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError("there's no user with this email", 404));

  // 2) generate randome resteToken

  const resteToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const restUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resteToken}`;
  const message = `forgot your password submit a PATCH req with your new password and passwrodConfirm to ${restUrl}\n if you did't forget please ignore this email ! `;

  try {
    await sendEmail({
      email: req.body.email,
      subject: `youre password reset Token valid for 10 mins`,
      message
    });
  } catch (error) {
    console.error(error);
    user.passwordRestToken = undefined;
    user.passwordResetExpiresIn = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('there was an error sending the email, try again later', 500)
    );
  }
  res.status(200).json({
    status: 'succecss',
    message: 'token sent via email'
  });
});
exports.resetPassword = catcAsync(async (req, res, next) => {
  // 1- get user based on the token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // 2- return user based on the token and check if the token is not expired

  const user = await User.findOne({
    passwordRestToken: hashedToken,
    passwordResetExpiresIn: { $gt: Date.now() }
  });

  if (!user)
    return next(
      new AppError('no User with this token or the token has expired', 401)
    );

  // 3- update changePasswordChangedAt for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordRestToken = undefined;
  user.passwordResetExpiresIn = undefined;
  await user.save();
  // 4- log the the in sen  jwt

  createAndSendToken(user, 200, res);
});

exports.updatePassword = catcAsync(async (req, res, next) => {
  // 1) get user
  const user = await User.findById(req.user.id).select('+password');

  // check if the password is correct

  if (!(await user.comparePassowrd(req.body.currentPassword, user.password)))
    return next(new AppError('password is inccorect please resend it!', 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createAndSendToken(user, 200, res);
});

