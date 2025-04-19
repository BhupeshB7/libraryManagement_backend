export const borrowJSONSchemaValidation = {
  bsonType: "object",
  required: [
    "bookId",
    "userId",
    "date",
    "dueDate",
    "returnDate",
    "status",
    "fine",
  ],
  properties: {
    _id: {
      bsonType: "objectId",
    },
    bookId: {
      bsonType: "objectId",
      description: "Book's ID must be a valid ObjectId",
    },
    userId: {
      bsonType: "objectId",
      description: "User's ID must be a valid ObjectId",
    },
    date: {
      bsonType: "date",
      description: "Borrow's date must be a valid date",
    },
    dueDate: {
      bsonType: "date",
      description: "Borrow's due date must be a valid date",
    },
    returnDate: {
      bsonType: "date",
      description: "Borrow's return date must be a valid date",
    },
    status: {
      bsonType: "string",
      description:
        "Borrow's status must be either 'pending', 'accepted', 'rejected' or 'returned'",
      enum: ["pending", "accepted", "rejected", "returned"],
    },
    fine: {
      bsonType: "number",
      description: "Fine's must be a Number",
    },
    createdAt: {
      bsonType: "date",
    },
    updatedAt: {
      bsonType: "date",
    },
  },
};
