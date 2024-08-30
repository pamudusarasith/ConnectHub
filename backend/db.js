import mongoose from "mongoose";

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(
      `Connected to database: ${mongoose.connection.db.databaseName}`
    );
  } catch (error) {
    console.log("Error while connecting to the database", error);
    throw error;
  }
}

export default connectToDatabase;