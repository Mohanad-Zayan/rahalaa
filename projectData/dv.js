const path = require('path');
const fs = require('fs');

const cities = [
    "alexandria",
    "cairo",
    "dahab",
    "sharm",
    "hurghada",
    "portSaid",
  ];


const subcategories = {} ; 
const subtypes = {} ; 

cities.forEach(city => {
    const directory = path.join(__dirname , 'cities' , city , 'attractions.json') ;
    const attractionsData = JSON.parse( fs.readFileSync(directory , 'utf-8')) ;

    subcategories[city] = new Set();
    subtypes[city] = new Set();
    
    attractionsData.forEach( attractionData => {
        attractionData.subcategory?.forEach( el => {
            subcategories[city].add(el.name) ;
        });
    });
    attractionsData.forEach( attractionData => {
        attractionData.subtype?.forEach( el => {
            subtypes[city].add(el.name) ;
        });
    });


});

console.log(subtypes);