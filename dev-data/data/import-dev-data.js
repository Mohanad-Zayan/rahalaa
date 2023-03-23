const fs =require('fs') ;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Review = require('../../models/Review.model');
const User = require('../../models/User.model');
const Tour = require('../../models/Tour.model');

dotenv.config();



// read file and convert string to object 
const tours = JSON.parse(fs.readFileSync(path.join(__dirname , 'tours.json') ,  'utf-8'))  ;
const users = JSON.parse(fs.readFileSync(path.join(__dirname , 'users.json') ,  'utf-8'))  ;
const reviews = JSON.parse(fs.readFileSync(path.join(__dirname , 'reviews.json') ,  'utf-8'))  ;


// connect to the dataBase 
const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose.connect(db).then(con => console.log(`DB connected ${con}`));




const importData = async () =>{
    try {
        await Tour.create(tours) ;
        await User.create(users , {validateBeforeSave : false }) ;
        await Review.create(reviews) ;
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

const deleteData = async () =>{
    try {
        await Tour.deleteMany() ;
        await Review.deleteMany() ;
        await User.deleteMany() ;
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

if(process.argv[2] == '--import'){
    importData()
} 
if(process.argv[2] == '--delete'){
    deleteData()
} 




