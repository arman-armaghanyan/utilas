const mongoose = require("mongoose");

let cachedConnection = null;

async function connectDB(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  mongoose.set("strictQuery", false);

  cachedConnection = await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || undefined,
  });

  return cachedConnection;
}

module.exports = {
  connectDB,
};

