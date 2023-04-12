const Attraction = require('../models/Attraction.model');
const factory = require('./handlerFactroy');



exports.deleteAttraction = factory.deleteOne(Attraction);
exports.updateAttraction = factory.updateOne(Attraction);
exports.createAttraction = factory.createOne(Attraction);
exports.getAttraction = factory.getOne(Attraction);
exports.getAllAttractions = factory.getAll(Attraction);
  


// /attractions-within/distance/:distance/center/:latlng/unit/:unit
exports.attractionsWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    
    if (!lat || !lng) {
      next(new AppError('please provide lat and lng in the format lat,lng', 400));
    }
    const attractions = await Attraction.find({
      location : { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        attractions
      }
    });
  });

