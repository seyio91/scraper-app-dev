const handleError = (err, res) => {
    const { statusCode, message } = err;
    res.status(500).json({
      status: "error",
      message
    });
  };

module.exports = handleError;