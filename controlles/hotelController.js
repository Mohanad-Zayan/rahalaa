const Hotel = require('../models/Hotel.model');
const factory = require('./handlerFactroy');



exports.deleteHotel = factory.deleteOne(Hotel);
exports.updateHotel = factory.updateOne(Hotel);
exports.createHotel = factory.createOne(Hotel);
exports.getHotel = factory.getOne(Hotel);
exports.getAllHotels = factory.getAll(Hotel);
  


