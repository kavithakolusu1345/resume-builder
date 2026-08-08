export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log the error internally
  console.error(`[Error Handler] ${err.message}`, err.stack);

  res.status(statusCode).json({
    message: err.message,
    // Only return stack trace in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
