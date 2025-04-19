export const reservationJSONSchemaValidation = {
  bsonType: "object",
  required: ["userId", "bookId", "reservedAt", "status"],
  properties: {
    _id: {
      bsonType: "objectId",
    },
    userId: {
      bsonType: "objectId",
      description: "User's ID must be a valid ObjectId", 
    },
    bookId: {
      bsonType: "objectId",
      description: "Book's ID must be a valid ObjectId", 
    },
    reservedAt: {
      bsonType: "date",
      description: "Reservation's date must be a valid date", 
    },
    status: {
      bsonType: "string",
      description:
        "Reservation's status must be either 'active', 'cancelled' or 'fulfilled'", 
      enum: ["active", "cancelled", "fulfilled"],
    },
    createdAt: {
      bsonType: "date",
    },
    updatedAt: {
      bsonType: "date",
    },
  },
};
