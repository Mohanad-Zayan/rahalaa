const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const City = require("../models/City.model");
const Hotel = require("../models/Hotel.model");
const Restaurant = require("../models/Restaurant.model");
const Attraction = require("../models/Attraction.model");

dotenv.config();


const database = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);
mongoose.connect(database).then((con) => console.log(`DB connected ${con}`));

const cities = [
  "alexandria",
  "cairo",
  "dahab",
  "sharm",
  "hurghada",
  "portSaid",
];
const citiesElements = ["restaurants", "attractions", "hotels"];
const rha_ids = {};


const adjustingDataShape= () => {
  cities.forEach(city => {
    citiesElements.forEach(el => {
      const directory = path.join(__dirname, "cities", city, `${el}.json`);
      const jsonObj = JSON.parse(fs.readFileSync(directory, "utf-8"));
  
      jsonObj.forEach((obj) => {
        const { latitude, longitude, address } = obj;
        delete obj.latitude;
        delete obj.longitude;
        delete obj.address;
      
        obj.location = {
          coordiantes: [latitude, longitude],
          address,
        }; 
      });
  
      fs.writeFileSync(directory , JSON.stringify(jsonObj)) ;
  
    });
  });
}


// (async function(){

//   try{
//     await mongoose.connection.dropCollection('restaurants')
//     await mongoose.connection.dropCollection('attractions')
//     await mongoose.connection.dropCollection('hotels')
//     await mongoose.connection.dropCollection('cities')
//   }catch(error){
//     console.log(error);
//   }
// }());


cities.forEach(async (city) => {
  rha_ids[city] = {};

  //
  citiesElements.forEach(async (el) => {
    rha_ids[city][el] = { ids: [] };

    
    const directory = path.join(__dirname, "cities", city, `${el}.json`);
    const jsonObj = JSON.parse(fs.readFileSync(directory, "utf-8"));

    
    if (el === "hotels") {
      try {
        const hotels = await Hotel.create(jsonObj);
        hotels.forEach((hotel) => {
          rha_ids[city].hotels.ids.push(hotel.id);
        });
        // newCity.hotels =  ;
        
      } catch (error) {
        console.log(error);
      }
    } else if (el === "restaurants") {
      try {
        const restaurants = await Restaurant.create(jsonObj);
        restaurants.forEach((restaurant) => {
          rha_ids[city].restaurants.ids.push(restaurant.id);
        });
      } catch (error) {
        console.log(error);
      }
    }else{
      try {
        const attractions = await Attraction.create(jsonObj);
        attractions.forEach((attraction) => {
          rha_ids[city].attractions.ids.push(attraction.id);
        });
      } catch (error) {
        console.log(error);
      }
    }
  
  });
});

setTimeout(() => {
  
  cities.forEach(async city => {
    console.log(city);
    const newCity = new City({
      name: city , 
      hotels :rha_ids[city].hotels.ids ,
      restaurants :rha_ids[city].restaurants.ids ,
      attractions :rha_ids[city].attractions.ids ,
    }) ;
    console.log(newCity);
    await newCity.save() ;
  });
}, 1000 * 60);



