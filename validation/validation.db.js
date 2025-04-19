import mongoose from "mongoose";
// import { userJSONSchemaValidation } from "./user.validation.schema.js";
// import { bookJSONSchemaValidation } from "./book.validation.schema.js";
import { borrowJSONSchemaValidation } from "./borrow.validation.schema.js";

const applyUserSchemaValidation = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/library_management_system"
    );
    console.log(`MongoDB Connected: ${connection.connection.host}`);

    const conn = mongoose.connection;
    const collections = await conn.db
      .listCollections({ name: "reservations" })
      .toArray();

    if (collections.length === 0) {
      await conn.createCollection("reservations", {
        validator: {
          $jsonSchema: borrowJSONSchemaValidation,
        },
        validationAction: "error",
        validationLevel: "strict",
      });
      console.log(
        "✅ book collection created with strict validation & error action."
      );
    } else {
      console.log("ℹ️ User collection already exists. Skipping creation.");
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
applyUserSchemaValidation();
