const City = require("../models/City.model");
const Plan = require("../models/Plan.model");

const catcAsync = require("../util/catcAsync");
const factory = require("./handlerFactroy");

exports.createPlan = factory.createOne(Plan);
exports.getPlan = factory.getOne(Plan);
exports.getAllPlans = factory.getAll(Plan);
exports.updatePlan = factory.updateOne(Plan);
exports.deletePlan = factory.deleteOne(Plan);

// exports.generatePlan = catcAsync(async (req, res, next) => {
//   const { cityName } = req.params;
//   console.log(cityName);

//   // Retrieve all hotels, restaurants, and attractions in the specified city
//   const city = await City.findOne({ name: cityName })
//     .populate("restaurants")
//     .populate("hotels")
//     .populate("attractions");

//   /* Filter out any hotels, restaurants, or attractions based on a specfic condation

//       / tb3n mfish el klam dah 3shan el application ai klam

//   */

//   // Create a plan object with a random hotel, restaurant, and attraction from the available options
//   const selectedHotel =
//     city.hotels[Math.floor(Math.random() * city.hotels.length)];

//   const selectedRestaurant =
//     city.restaurants[Math.floor(Math.random() * city.restaurants.length)];

//   const selectedAttraction =
//     city.attractions[Math.floor(Math.random() * city.attractions.length)];

//   const plan = {
//     hotel: selectedHotel,
//     restaurant: selectedRestaurant,
//     attraction: selectedAttraction,
//   };

//   res.status(200).json({
//     status: "success",
//     data: {
//       plan,
//     },
//   });
// });

// exports.generatePlans = catcAsync(async (req, res, next) => {
//   const { cityName } = req.params;
//   const { numberOfPlans } = req.body;

//   // Retrieve all hotels, restaurants, and attractions in the specified city
//   const city = await City.findOne({ name: cityName })
//     .populate("restaurants")
//     .populate("hotels")
//     .populate("attractions");

//   /* Filter out any hotels, restaurants, or attractions based on a specific condition
//        (e.g., availability during the specified dates) */

//   // Create an array to hold the generated plans
//   const plans = [];

//   // Generate the specified number of plans
//   for (let i = 0; i < numberOfPlans; i++) {
//     const selectedHotel =
//       city.hotels[Math.floor(Math.random() * city.hotels.length)];

//     const selectedRestaurant =
//       city.restaurants[Math.floor(Math.random() * city.restaurants.length)];

//     const selectedAttraction =
//       city.attractions[Math.floor(Math.random() * city.attractions.length)];

//     const plan = {
//       hotel: selectedHotel,
//       restaurant: selectedRestaurant,
//       attraction: selectedAttraction,
//     };

//     plans.push(plan);
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       plans,
//     },
//   });
// });

exports.generatePlans = catcAsync(async (req, res, next) => {
  let { cityName } = req.params;
  const {
    numberOfPlans = 1,
    numberOfRestaurants = 1,
    numberOfAttractions = 1,
  } = req.body;

  cityName = cityName.toLowerCase();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  // Retrieve all hotels, restaurants, and attractions in the specified city
  const city = await City.findOne({ name: cityName })
    .populate("restaurants")
    .populate("hotels")
    .populate("attractions");

  /* Filter out any hotels, restaurants, or attractions based on a specific condition 
       (e.g., availability during the specified dates) */

  // Create an array to hold the generated plans
  const plans = [];

  // Generate the specified number of plans
  for (let i = 0; i < numberOfPlans; i++) {
    const selectedRestaurants = city.restaurants
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfRestaurants);

    const selectedAttractions = city.attractions
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfAttractions);

    const selectedHotel =
      city.hotels[Math.floor(Math.random() * city.hotels.length)];

  
    const selectedPlan = {
      name: `${cityName}-${i + 1}`,
      image: selectedAttractions[0].image,

      // hotels: selectedHotel,
      // restaurants: selectedRestaurants,
      // attractions: selectedAttractions,
      
      places: [ selectedHotel, ...selectedRestaurants, ...selectedAttractions ],
    };

    // Add the generated plan to the array of plans
    plans.push(selectedPlan);
  }

  res.status(200).json({
    status: "success",
    data: {
      plans,
    },
  });
});
