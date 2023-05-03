  const express = require('express');
const userController = require('./../controlles/userController');
const authController = require('./../controlles/authController');

const router = express.Router();
//NORMAL USER

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgetpassword', authController.forgetPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPasswrod',
  authController.protect,
  authController.updatePassword
);

//protect all routes after it
router.use(authController.protect); 




router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);


//restrict to admin

router.use(authController.restrictTo('admin' ));

// Admin Endpoints .
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
