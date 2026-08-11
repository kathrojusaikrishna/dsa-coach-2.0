const multer = require("multer");

function errorHandler(err, req, res, next) {
  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large (max 5MB)",
      });
    }

    return res.status(400).json({
      message: err.message,
    });
  }

  // Custom PDF validation error
  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Unexpected errors
  console.error(err);

  return res.status(500).json({
    message: "Internal server error",
  });
}

module.exports = errorHandler;
