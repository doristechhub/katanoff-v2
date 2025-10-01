class CustomError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
