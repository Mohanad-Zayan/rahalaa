const Hotel = require("../models/Hotel.model");
const Restaurant = require("../models/Restaurant.model");
const Attraction = require("../models/Attraction.model");

// getCityPlan = async (cityName, priceLevel, ratingLevel) => {
//   let hotels, restaurants, attractions;

//   if (priceLevel) {
//     hotels = await Hotel.find({ city: cityName, priceLevel });
//     restaurants = await Restaurant.find({ city: cityName, priceLevel });
//   } else {
//     hotels = await Hotel.find({ city: cityName });
//     restaurants = await Restaurant.find({ city: cityName });
//   }

//   if (ratingLevel) {
//     hotels = hotels.filter((hotel) => hotel.rating >= ratingLevel);
//     restaurants = restaurants.filter(
//       (restaurant) => restaurant.rating >= ratingLevel
//     );
//     attractions = await Attraction.find({
//       city: cityName,
//       rating: { $gte: ratingLevel },
//     });
//   } else {
//     attractions = await Attraction.find({ city: cityName });
//   }

//   return { hotels, restaurants, attractions };
// };


// const City = require('../models/City.model');

// async function getCityPlan(cityName, priceLevel, ratingLevel) {
//   const city = await City.findOne({ name: cityName })
//     // .populate('restaurants', 'name rating priceLevel')
//     // .populate('hotels', 'name rating priceLevel')
//     // .populate('attractions', 'name rating description image');

//   let hotels = city.hotels;
//   let restaurants = city.restaurants;
//   let attractions = city.attractions;

//   if (priceLevel) {
//     hotels = hotels.filter(hotel => hotel.priceLevel === priceLevel);
//     restaurants = restaurants.filter(restaurant => restaurant.priceLevel === priceLevel);
//   }

//   if (ratingLevel) {
//     hotels = hotels.filter(hotel => hotel.rating >= ratingLevel);
//     restaurants = restaurants.filter(restaurant => restaurant.rating >= ratingLevel);
//     attractions = attractions.filter(attraction => attraction.rating >= ratingLevel);
//   }

//   return { hotels, restaurants, attractions };
// }


// async function getCityPlan(cityName, priceLevel, ratingLevel) {
//     let query = { name: cityName };
  
//     if (priceLevel) {
//       query['hotels.priceLevel'] = priceLevel;
//       query['restaurants.priceLevel'] = priceLevel;
//     }
  
//     if (ratingLevel) {
//       query['hotels.rating'] = { $gte: ratingLevel };
//       query['restaurants.rating'] = { $gte: ratingLevel };
//       query['attractions.rating'] = { $gte: ratingLevel };
//     }
  
//     const city = await City.findOne(query)
//       .populate('restaurants', 'name rating priceLevel')
//       .populate('hotels', 'name rating priceLevel')
//       .populate('attractions', 'name rating description image');
  
//     return { hotels: city.hotels, restaurants: city.restaurants, attractions: city.attractions };
//   }


async function getCityPlan(cityName, priceLevel, ratingLevel) {
    
    const pipeline = [
      { $match: { name: cityName } },
      {
        $lookup: {
          from: 'hotels',
          localField: 'hotels',
          foreignField: '_id',
          as: 'hotels'
        }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurants',
          foreignField: '_id',
          as: 'restaurants'
        }
      },
      {
        $lookup: {
          from: 'attractions',
          localField: 'attractions',
          foreignField: '_id',
          as: 'attractions'
        }
      }
    ];
  
    if (priceLevel) {
      pipeline.push({
        $match: {
          $or: [
            { 'hotels.priceLevel': priceLevel },
            { 'restaurants.priceLevel': priceLevel }
          ]
        }
      });
    }
  
    if (ratingLevel) {
      pipeline.push({
        $match: {
          $or: [
            { 'hotels.rating': { $gte: ratingLevel } },
            { 'restaurants.rating': { $gte: ratingLevel } },
            { 'attractions.rating': { $gte: ratingLevel } }
          ]
        }
      });
    }
  
    const city = await City.aggregate(pipeline);
  
    return { hotels: city[0].hotels, restaurants: city[0].restaurants, attractions: city[0].attractions };
  }