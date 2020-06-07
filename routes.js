module.exports = function (app) {
    app.use("/api", require("./api/user/user.routes.js"));
    app.use("/api", require("./api/auth/login"));
}