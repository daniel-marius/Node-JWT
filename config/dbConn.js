const mongoose = require("mongoose");

const dbConnection = async () => {
  const connectOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  };

  const dbConnectUri = process.env.MONGODB_URI;
  mongoose.Promise = global.Promise;
  
  try {
    const currentConnection = await mongoose.connect(
      dbConnectUri,
      connectOptions
    );

    console.log(
      `Connected to MongoDB Atlas Cluster: ${currentConnection.connection.host}`
    );
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1); // exit with failure
  }
};

module.exports = dbConnection;
