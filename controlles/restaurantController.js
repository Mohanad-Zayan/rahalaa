const Restaurant = require('../models/Restaurant.model');
const factory = require('./handlerFactroy');
const catcAsync = require('../util/catcAsync');



// exports.createRestaurant = factory.createOne(Restaurant);
exports.getRestaurant = factory.getOne(Restaurant);
// exports.getAllRestaurants = factory.getAll(Restaurant);
exports.updateRestaurant = factory.updateOne(Restaurant);
exports.deleteRestaurant = factory.deleteOne(Restaurant);

exports.getAllHotels = catcAsync(async (req, res) => {
  // Check if the user role is admin or user
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'user')) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not authorized to access this resource.'
    });
  }

  const hotels = await Hotel.find({ 'status': 'active' });

  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: {
      hotels
    }
  });
});

exports.createRestaurant = catcAsync(async (req, res) => {
  let document;
  
  // Check user role
  if (req.user.role === 'admin') {
    document = await Restaurant.create(
      {
        ...req.body,
        status: 'active'
      });

  } else if (req.user.role === 'business_owner') {

    document = await Restaurant.create({
      ...req.body,
      status: 'in-active',
      createdBy: req.user._id
    });
    await document.save();

    res.status(201).json({
      status: 'success',
      data: {
        document,
      },
    });
  };
});



exports.getAllRestaurants = catcAsync(async (req, res) => {
  // const restaurants = await Restaurant.find({ 'status': 'active' });
  let restaurants;

  if (req.user.role === 'user') {
    restaurants = await Restaurant.find({ 'status': 'active' });
  } else if (req.user.role === 'business_owner') {
    restaurants = await Restaurant.find({ 'createdBy': req.user._id });
  }

  // if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'user')) {
  //   return res.status(401).json({
  //     status: 'error',
  //     message: 'You are not authorized to access this resource.'
  //   });
  // }
  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    data: {
      restaurants
    }
  });
});

exports.getInactiveRestaurants = catcAsync(async (req, res) => {
  const inactiveRestaurants = await Restaurant.find({ status: 'in-active' }).lean();

  res.status(200).json({
    status: 'success',
    results: inactiveRestaurants.length,
    data: {
      restaurants: inactiveRestaurants
    }
  });
});


// /restaurants-within/distance/:distance/center/:latlng/unit/:unit
exports.restaurantsWithin = catcAsync(async (req, res, next) => {
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

