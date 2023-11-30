const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDb = (uri) => {
  return mongoose.connect(uri, {
  }).then(() => {
    console.log('Connected to Database Successfully');
  }).catch((error) => {
    console.log(error);
  })
}

module.exports = connectDb;