const Restaurant = require('../models/Restaurant.model');
const factory = require('./handlerFactroy');



exports.deleteRestaurant = factory.deleteOne(Restaurant);
exports.updateRestaurant = factory.updateOne(Restaurant);
exports.createRestaurant = factory.createOne(Restaurant);
exports.getRestaurant = factory.getOne(Restaurant);
exports.getAllRestaurants = factory.getAll(Restaurant);
  


