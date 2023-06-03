const Actvity = require('../models/Actvity.model');
const Attraction = require('../models/Attraction.model');

const dotenv = require("dotenv");
const mongoose = require("mongoose");
 
dotenv.config();


const database = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);
mongoose.connect(database).then((con) => console.log(`DB connected ${con}`));


const activitiesToBeRemoved = [
    'Tours' , 
    'Transportation' 
] ;

let attractionsAssoiatedToActvities = [] ;
let activityId = [] ;

let i = 0 ; 
activitiesToBeRemoved.forEach( async activity => {

    const reterivedActvities = await Actvity.find( {type: activity} ) ; 
    
    
    reterivedActvities.forEach( activity => {
        activityId.push(activity.id) ;
        activity.attractions.forEach(attraction => {
            if(attraction.id ){
                attractionsAssoiatedToActvities.push(attraction.id) ;
            }
        });
    });
    

    // await Actvity.findByIdAndDelete( reterivedActvity._id ) ; 


});


setTimeout(async () => {
    try {
        attractionsAssoiatedToActvities.forEach(async id => {
            await Attraction.findByIdAndDelete(id)
        });
        activityId.forEach(async id=> {
            // console.log(id);
            await Actvity.findByIdAndDelete(id)
        });    

    } catch (error) {
        console.log(`error ${error}`);
    }
}, 5000 * 5 );

// setTimeout(() => {
//     console.log(activityId);    
//     console.log('______________________________');
//     console.log(attractionsAssoiatedToActvities);    
// }, 5000 );




