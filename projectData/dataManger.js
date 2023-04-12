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



const adjustingDataShape = () => {
  cities.forEach(city => {
    citiesElements.forEach(el => {
      const directory = path.join(__dirname, "cities", city, `${el}.json`);
      const jsonObj = JSON.parse(fs.readFileSync(directory, "utf-8"));
  
      jsonObj.forEach((obj) => {
        const { latitude, longitude, address , subtype , subcategory } = obj;
        delete obj.latitude;
        delete obj.longitude;
        delete obj.address;
        delete obj.subtype
        delete obj.subcategory
        
        obj.location = {
          
          coordiantes: [latitude, longitude],
          address,
        }; 

        if(el == 'attractions'){
          console.log(subcategory);
          // console.log();
          const activities = subcategory?.map(el => el.name); 
          const activityDesctiptor = subtype?.map(el => el.name);
  
          obj.activities = activities ;
          obj.activityDesctiptor = activityDesctiptor ;
        }


      });


      fs.writeFileSync(directory , JSON.stringify(jsonObj)) ;
  
  
    });
  });
}



// adjustingDataShape()

const collectionsCleaning = () =>{
  (async function(){
  
  try{
      await mongoose.connection.dropCollection('restaurants')
      await mongoose.connection.dropCollection('attractions')
      await mongoose.connection.dropCollection('hotels')
      await mongoose.connection.dropCollection('cities')
    }catch(error){
      console.log(error);
    }
  }());
}

const generalDataCreation = () => {

  cities.forEach(async (city) => {
    rha_ids[city] = {};
  
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
}





const city_activities_attractionsId = {} ;


// CREATE ACTIVITIES AND ASSIOCATING WITH THE THIER ATTRACTIONS 
const extractingActvitiesAndAssociatingWithAttractions =async () => {
  


  cities.forEach(city => {
      const directory = path.join(__dirname, "cities", city, "attractions.json");
      const attractionsObj = JSON.parse(fs.readFileSync(directory, "utf-8"));
      city_activities_attractionsId[city] = new Set() ; 
      
      
        attractionsObj.forEach(attraction => {
          
          // extracting all actvties
          attraction.activities?.forEach(activity =>{
            city_activities_attractionsId[city].add(activity)  ; 
          })
          
          
        });    
        
        city_activities_attractionsId[city].forEach( activity => {
          
          
          city_activities_attractionsId[city][activity] = [] ;
    
          attractionsObj.forEach(async attraction=> {
    
            if(attraction.activities.includes(activity)){
    
              const attractionDbRecord = await Attraction.findOne({name : attraction.name })
              city_activities_attractionsId[city][activity].push(attractionDbRecord.id) ;     
    
            }
          });
    
        }); 
            
      
  });
  
  
    
  
  
}

const cities_actvities_Db_records = {} ;

const creatingActvties =  () =>{
  console.log(city_activities_attractionsId);
  cities.forEach(city => {

    cities_actvities_Db_records[city] = [] ;

      city_activities_attractionsId[city].forEach( async activity =>{
        const newActivity= await Actvity.create({
          type : activity , 
          city :city , 
          attractions: city_activities_attractionsId[city][activity]   
        }) ; 
        
        cities_actvities_Db_records[city].push(newActivity.id) ;

      })
  });
}

generalDataCreation() 
extractingActvitiesAndAssociatingWithAttractions() 

setTimeout(() => {
   
  creatingActvties()
  
}, 1000 * 60 * 15 );



setTimeout(() => {
  cities.forEach(async city => {
    
    const newCity = new City({
      name: city.charAt(0).toUpperCase() + city.slice(1) , 

      hotels :rha_ids[city].hotels.ids ,
      
      restaurants :rha_ids[city].restaurants.ids ,

      attractions :rha_ids[city].attractions.ids ,

      activities : cities_actvities_Db_records[city] ,

    }) ;
    await newCity.save() ;
  });
  
}, 1000 * 60 * 16 );

