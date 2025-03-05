class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong",
    errors = [],
    stactk = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message
    this.success = false
    this.errors= errors

    if (stactk){
      this.stack = stactk
    }
    else{
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
export { ApiError };
