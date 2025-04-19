export const bookJSONSchemaValidation = {
  bsonType: "object",
  required: ["title", "author", "isbn", "category", "stock", "available"],
  properties: {
    _id: {
      bsonType: "objectId",
    },
    title: {
      bsonType: "string",
      description: "Book's title must be a string with minimum 3 characters",
      minLength: 3,
    },
    author: {
      bsonType: "string",
      description: "Book's author must be a string with minimum 3 characters",
      minLength: 3,
    },
    isbn: {
      bsonType: "string",
      description: "Book's ISBN must be a string with minimum 10 characters",
      minLength: 10,
    },
    category: {
      bsonType: "string",
      description: "Book's category must be a string with minimum 3 characters",
      minLength: 3,
    },
    stock: {
      bsonType: "number",
      description: "Book's stock must be a number between 0 and 100",
      minimum: 0,
      maximum: 100,
    },
    available: {
      bsonType: "bool",
      description: "Book's availability must be a boolean",
    },
    createdAt: {
      bsonType: "date",
    },
    updatedAt: {
      bsonType: "date",
    },
  },
};
