




// Function for testing the API
const testApi = async (req, res, next) => {
  res.status(200).json('Welcome to Intelliquest backend');
};







module.exports = { testApi };