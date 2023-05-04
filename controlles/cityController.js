const City = require("../models/City.model");
const Hotel = require("../models/Hotel.model");
const Restaurant = require("../models/Restaurant.model");
const Attraction = require("../models/Attraction.model");
const Actvity = require("../models/Actvity.model");
const AppError = require("../util/AppError");

const catchAsync = require("../util/catcAsync");

// hotelss
exports.getAllCityHotels = catchAsync(async (req, res, next) => {
  let cityName = req.params.city;

  cityName = cityName.toLowerCase();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  const [city] = await City.find({ name: cityName })
    .select({ hotels: 1 })
    .populate("hotels");

  if (!city) {
    return next(new AppError("City not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      hotels: city.hotels,
    },
  });
});

exports.createCityHotel = catchAsync(async (req, res, next) => {
  const cityName = req.params.city;

  const city = await City.find({ name: cityName }).select({ hotels: 1 });

  if (!city) {
    return next(new AppError("City not found", 404));
  }

  const hotel = await Hotel.create(req.body);

  city.hotels.push(hotel._id);
  await city.save();

  res.status(201).json({
    status: "success",
    data: {
      hotel,
    },
  });
});

exports.getCityHotel = catchAsync(async (req, res, next) => {
  let cityName = req.params.city;

  cityName = cityName.toLowerCase();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  const hotelId = req.params.id;

  const [city] = await City.find({ name: cityName }).select({ hotels: 1 });

  const hotel = await Hotel.findById(hotelId);

  if (!city || !city.hotels.includes(hotelId)) {
    return next(new AppError("Hotel not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      hotel,
    },
  });
});

exports.updateCityHotel = catchAsync(async (req, res, next) => {
  const cityName = req.params.city;
  const hotelId = req.params.hotelId;

  const city = await City.find({ name: cityName })
    .populate("hotels")
    .select({ hotels: 1 });
  const hotel = await Hotel.findByIdAndUpdate(hotelId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!city || !city.hotels.includes(hotelId)) {
    return next(new AppError("Hotel not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      hotel,
    },
  });
});

exports.deleteCityHotel = catchAsync(async (req, res, next) => {
  const cityName = req.params.city;
  const hotelId = req.params.hotelId;

  const city = City.find({ name: cityName })
    .populate("hotels")
    .select({ hotels: 1 });

  if (!city || !city.hotels.includes(hotelId)) {
    return next(new AppError("Hotel not found", 404));
  }

  await Hotel.findByIdAndDelete(hotelId);

  city.hotels = city.hotels.filter((id) => id.toString() !== hotelId);
  await city.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// restraunt noww
exports.getAllCityRestaurants = catchAsync(async (req, res, next) => {
  let cityName = req.params.city;

  cityName = cityName.toLowerCase();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  const [city] = await City.find({ name: cityName })
    .select({ restaurants: 1 })
    .populate("restaurants");

  if (!city) {
    return next(new AppError("City not found", 404));
  }

  res.status(200).json({
    status: "success",
    length: city.restaurants.length,
    data: {
      restaurants: city.restaurants,
    },
  });
});

exports.createCityRestaurant = catchAsync(async (req, res, next) => {
  const cityName = req.params.city;

  const city = await City.find({ name: cityName }).select({ restaurants: 1 });

  if (!city) {
    return next(new AppError("City not found", 404));
  }

  const restaurant = await Restaurant.create(req.body);

  city.restaurants.push(restaurant._id);
  await city.save();

  res.status(201).json({
    status: "success",
    data: {
      restaurant,
    },
  });
});

exports.getCityRestaurant = catchAsync(async (req, res, next) => {
  let cityName = req.params.city;

  cityName = cityName.toLowerCase();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  const restaurantId = req.params.id;

  const [city] = await City.find({ name: cityName }).select({ restaurants: 1 });
  const restaurant = await Restaurant.findById(restaurantId);

  if (!city || !city.restaurants.includes(restaurantId)) {
    return next(new AppError("Restaurant not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      restaurant,
    },
  });
});

exports.updateCityRestaurant = catchAsync(async (req, res, next) => {
  const cityName = req.params.city;
  const restaurantId = req.params.restaurantId;

  const city = await City.find({ name: cityName })
    .populate("restaurants")
    .select({ restaurants: 1 });
  const restaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!city || !city.restaurants.includes(restaurantId)) {
    return next(new AppError("Restaurant not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      restaurant,
    },
  });
});

exports.deleteCityRestaurant = catchAsync(async (req, res, next) => {
  const cityName = req.params.city;
  const restaurantId = req.params.restaurantId;

  const city = City.find({ name: cityName })
    .populate("restaurants")
    .select({ restaurants: 1 });

  if (!city || !city.restaurants.includes(restaurantId)) {
    return next(new AppError("Restaurant not found", 404));
  }

  await Restaurant.findByIdAndDelete(restaurantId);

  city.restaurants = city.restaurants.filter(
    (id) => id.toString() !== restaurantId
  );
  await city.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// attractions

//
exports.getAllCityAttractions = catchAsync(async (req, res, next) => {
  let cityName = req.params.city;

  cityName = cityName.toLowerCase();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  const [city] = await City.find({ name: cityName })
    .select({ attractions: 1 })
    .populate("attractions");

  if (!city) {
    return next(new AppError("City not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      attractions: city.attractions,
    },
  });
});

exports.createCityAttraction = catchAsync(async (req, res, next) => {
  let cityName = req.params.city;

  cityName = cityName.toLowerCase();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  const city = await City.find({ name: cityName }).select({ attractions: 1 });

  if (!city) {
    return next(new AppError("City not found", 404));
  }

  const attraction = await Attraction.create(req.body);

  city.attractions.push(attraction._id);
  await city.save();

  res.status(201).json({
    status: "success",
    data: {
      attraction,
    },
  });
});

exports.getCityAttraction = catchAsync(async (req, res, next) => {
  let cityName = req.params.city;

  cityName = cityName.toLowerCase();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  const attractionId = req.params.id;

  const [city] = await City.find({ name: cityName }).select({ attractions: 1 });
  const attraction = await Attraction.findById(attractionId);

  if (!city || !city.attractions.includes(attractionId)) {
    return next(new AppError("Attraction not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      attraction,
    },
  });
});

exports.updateCityAttraction = catchAsync(async (req, res, next) => {
  const cityName = req.params.city;
  const attractionId = req.params.attractionId;

  const city = await City.find({ name: cityName })
    .populate("attractions")
    .select({ attractions: 1 });
  const attraction = await Attraction.findByIdAndUpdate(
    attractionId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!city || !city.attractions.includes(attractionId)) {
    return next(new AppError("Attraction not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      attraction,
    },
  });
});

exports.deleteCityAttraction = catchAsync(async (req, res, next) => {
  const cityName = req.params.city;
  const attractionId = req.params.attractionId;

  const city = City.find({ name: cityName })
    .populate("attractions")
    .select({ attractions: 1 });

  if (!city || !city.attractions.includes(attractionId)) {
    return next(new AppError("Attraction not found", 404));
  }

  await Attraction.findByIdAndDelete(attractionId);

  city.attractions = city.attractions.filter(
    (id) => id.toString() !== attractionId
  );
  await city.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// activities

exports.getAllCityActivities = catchAsync(async (req, res, next) => {
  let cityName = req.params.city;
  cityName = cityName.toLowerCase();
  // Retrieve all distinct activity types for the city
  const activityTypes = await Actvity.distinct("type", { city: cityName });

  console.log(cityName);
  // Return the activity types in the response
  res.status(200).json({
    status: "success",
    data: {
      activityTypes,
    },
  });
});

exports.getAllCityActivitiesAttractions = catchAsync(async (req, res, next) => {
  let cityName = req.params.city;
  cityName = cityName.toLowerCase();

  const activityType = req.params.activity;

  console.log(activityType);
  // Find the activity with the specified type and city and populate its attractions
  const activity = await Actvity.findOne({
    type: activityType,
    city: cityName,
  }).populate("attractions");

  // If the activity is not found, return an error response
  if (!activity) {
    return next(new AppError("Attraction for this activity not found", 404));
  }

  // Return the attractions in the response
  res.status(200).json({
    status: "success",
    data: {
      attractions: activity.attractions,
    },
  });
});

exports.getAllCities = catchAsync(async (req, res, next) => {
  const cities = await City
    .find()
    .populate('hotels')
    .populate('restaurants')
    .populate('activities')
    .select({attractions : 0})
  
  if(!cities){
    return new AppError('No cities found' , 404)
  }

  res.status(200).json({
    status: "success" , 
    data: {
      cities
    }
  })
});
exports.getOneCity = catchAsync(async (req, res, next) => {
  let cityName = req.params.city;

  cityName = cityName.toLowerCase();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  const cities = await City
    .findOne({name : cityName}) 
    .populate('hotels')
    .populate('restaurants')
    .populate('activities')
    .select({attractions : 0})
  
  if(!cities){
    return next(new AppError('No cities found' , 404))
  }

  res.status(200).json({
    status: "success" , 
    data: {
      cities
    }
  })
});
