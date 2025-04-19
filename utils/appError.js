export class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.name || "APIError";
    this.message = message;
    this.stack = new Error().stack;
    this.status = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
