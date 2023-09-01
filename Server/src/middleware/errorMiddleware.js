const errorMiddleware = (err, req, res, next) => {
    console.error(err.message);
  
    res.status(500).json({
        error: true,
        code: "INTERNAL_SERVER_ERROR",
        message: err.message
    });
};

module.exports = errorMiddleware;