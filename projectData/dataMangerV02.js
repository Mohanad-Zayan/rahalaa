const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const City = require("../models/City.model");
const Hotel = require("../models/Hotel.model");
const Restaurant = require("../models/Restaurant.model");
const Attraction = require("../models/Attraction.model");
const Actvity = require("../models/Actvity.model");

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



const city_activities_attractionsId = {} ;
const cities_actvities_Db_records = {} ;

const extractingActivitiesAndAssociatingWithAttractions = async () => {
    for (const city of cities) {
      const directory = path.join(__dirname, "cities", city, "attractions.json");
      const attractionsObj = JSON.parse(fs.readFileSync(directory, "utf-8"));
      city_activities_attractionsId[city] = {};
  
      for (const attraction of attractionsObj) {
        const activities = attraction.activities || [];
  
        for (const activity of activities) {
          city_activities_attractionsId[city][activity] =
            city_activities_attractionsId[city][activity] || [];
  
          const attractionDbRecord = await Attraction.findOne({
            name: attraction.name
          });
          if (attractionDbRecord) {
            city_activities_attractionsId[city][activity].push(
              attractionDbRecord.id
            );
          } else {
            console.log(`Attraction not found: ${attraction.name}`);
          }
        }
      }
    }
    
  };
  

const creatingActivities = async () => {
    
    for (const city of cities) {
      cities_actvities_Db_records[city] = [];
  
      await Promise.all(
        Array.from(city_activities_attractionsId[city]).map(async activity => {
          const newActivity = await Activity.create({
            type: activity,
            city: city,
            attractions: city_activities_attractionsId[city][activity]
          });
  
          cities_actvities_Db_records[city].push(newActivity.id);
        })
      );
    }
  };

  
// extractingActivitiesAndAssociatingWithAttractions();
// creatingActivities();
  

