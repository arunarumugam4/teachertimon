// standard response format

module.exports = (err, msg, statusCode, data) => {

    return {
        error: err,
        message: msg,
        statusCode: statusCode,
        data: data
    }
}