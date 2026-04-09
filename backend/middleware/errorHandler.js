const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? 'Something went wrong on the server.' : err.message || 'Request failed.';

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
