const responseHandler = require("../../util/responseHandler"),
    service = require("./user.service");

module.exports.get = function (req, res) {
    service.get({
        userId: req.user._id
    }).then(data => responseHandler.sucess(res, data))
        .catch(error => responseHandler.error(res, error))
}

module.exports.create = function (req, res) {
    service.create({
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        email: req.query.email,
        password: req.query.password
    }).then(data => responseHandler.sucess(res, data))
        .catch(error => responseHandler.error(res, error))
}