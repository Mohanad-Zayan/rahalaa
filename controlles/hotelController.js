const Hotel = require('../models/Hotel.model');
const catcAsync = require('../util/catcAsync');
const factory = require('./handlerFactroy');



exports.createHotel = factory.createOne(Hotel);
exports.getHotel = factory.getOne(Hotel); 
exports.getAllHotels = factory.getAll(Hotel);
exports.updateHotel = factory.updateOne(Hotel);
exports.deleteHotel = factory.deleteOne(Hotel);

// /hotels-within/distance/:distance/center/:latlng/unit/:unit
exports.hotelsWithin = catcAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    
    if (!lat || !lng) {
      next(new AppError('please provide lat and lng in the format lat,lng', 400));
    }
    const hotels = await Hotel.find({
      location : { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        hotels
      }
    });
  });


  


