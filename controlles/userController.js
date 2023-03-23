const User = require('../models/User.model');
const AppError = require('../util/AppError');
const catcAsync = require('../util/catcAsync');
const factory = require('../controlles/handlerFactroy');

const fillterObj = (obj, ...allowedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFileds.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
  


exports.updateMe = catcAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not specfied to cahnge password please used /updateMyPasswrod route instead',
        400
      )
    );

  const fillterdObj = fillterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, fillterdObj, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
exports.deleteMe = catcAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});
exports.getMe = catcAsync(async (req, res, next) => {
  req.params.id = req.user.id ;
  next() ;
});

// exports.updateUser = catcAsync( async (req, res , next) => {
//   const user = await User.findByIdAndUpdate(req.params.id , res.body , {
//     new: true ,
//     runValidators : true
//   } ) ;

//   if(!user) return next(new AppError("No User Found With this id" , 404)) ;

//   res.status(200).json({
//     status: 'success',
//       data: {
//         updateUser: user
//       }
//   });
// });
// exports.deleteUser = catcAsync( async (req, res) => {
//     await User.findByIdAndDelete(req.params.id) ;

//   res.status(204).json({
//     status: 'success',
//     data : null
//   });
// })
