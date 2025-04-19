export const userJSONSchemaValidation = {
  bsonType: "object",
  required: ["name", "email", "password", "role"],
  properties: {
    _id: {
      bsonType: "objectId",
    },
    name: {
      bsonType: "string",
      description: "User's name must be a string with minimum 3 characters",
      minLength: 3,
    },
    email: {
      bsonType: "string",
      description: "User's email must be a string with minimum 3 characters",
      minLength: 3,
      pattern: "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
    },
    password: {
      bsonType: "string",
      description: "User's password must be a string with minimum 8 characters",
      minLength: 8,
    },
    role: {
      bsonType: "string",
      description: "User's role must be either 'admin' or 'user'",
      enum: ["admin", "user"],
    },
    deletedAt: {
      bsonType: ["null", "date"],
    },
    createdAt: {
      bsonType: "date",
    },
    updatedAt: {
      bsonType: "date",
    },
  },
  additionalProperties: false,
};
