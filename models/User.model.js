const mongoose = require('mongoose');
const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provde a valid email']
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    
    enum: ['user', 'business_owner'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minLength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confrim your password'],
    validate: {
      validator: function(password) {
        return this.password === password;
      },
      message: "The passwords doesn't match "
    }
  },
  passwordChangedAt: Date,
  passwordRestToken: String,
  passwordResetExpiresIn: Date , 
  active:{
    type : Boolean , 
    default : true ,
    select : false 
  }
},{
  toJSON : {virtuals : true} , 
  toObject : {virtuals : true} , 

});


//HASH
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();

});




userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000 ;

  next();
});

userSchema.pre(/^find/,  async function(next){
  this.find({active : {$ne : false}}) ;

  next(); 
})

userSchema.methods.comparePassowrd = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const restToken = crypto.randomBytes(32).toString('hex');

  this.passwordRestToken = crypto
    .createHash('sha256')
    .update(restToken)
    .digest('hex');

  this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000 ;


  return restToken;
};


const User = mongoose.model('User', userSchema);

module.exports = User;
