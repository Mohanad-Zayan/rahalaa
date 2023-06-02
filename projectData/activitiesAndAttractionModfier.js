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


activitiesToBeRemoved.forEach( async activity => {

    const reterivedActvity = await Actvity.findOne( {type: activity} ) ; 
    
    
    attractionsAssoiatedToActvities.push(reterivedActvity.attractions);
    // console.log(reterivedActvity.id);

    // await Actvity.findByIdAndDelete( reterivedActvity._id ) ; 


});


setTimeout(() => {
    attractionsAssoiatedToActvities.forEach(el => {
        console.log(el);

    });
    // console.log(attractionsAssoiatedToActvities);
}, 5000 * 5);




