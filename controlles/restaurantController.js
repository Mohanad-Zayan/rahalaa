const Restaurant = require('../models/Restaurant.model');
const factory = require('./handlerFactroy');



exports.createRestaurant = factory.createOne(Restaurant);
exports.getRestaurant = factory.getOne(Restaurant);
exports.getAllRestaurants = factory.getAll(Restaurant);
exports.updateRestaurant = factory.updateOne(Restaurant);
exports.deleteRestaurant = factory.deleteOne(Restaurant);
  


// /restaurants-within/distance/:distance/center/:latlng/unit/:unit
exports.restaurantsWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    
    if (!lat || !lng) {
      next(new AppError('please provide lat and lng in the format lat,lng', 400));
    }
    const restaurants = await Restaurant.find({
      location : { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        restaurants
      }
    });
  });

