const errorHandling = (err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: err.message
    });
};

export default errorHandling