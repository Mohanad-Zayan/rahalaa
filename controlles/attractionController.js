const Attraction = require('../models/Attraction.model');
const factory = require('./handlerFactroy');



exports.deleteAttraction = factory.deleteOne(Attraction);
exports.updateAttraction = factory.updateOne(Attraction);
exports.createAttraction = factory.createOne(Attraction);
exports.getAttraction = factory.getOne(Attraction);
exports.getAllAttractions = factory.getAll(Attraction);
  


