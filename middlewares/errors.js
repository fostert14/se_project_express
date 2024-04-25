module.exports = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).send({
    message: err.message || "An unexpected error occured on the server",
  });
};
