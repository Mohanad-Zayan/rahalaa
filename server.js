
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const app = require('./app');


const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(db).then(con => console.log('DB connected'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


