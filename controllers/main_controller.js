module.exports.controller = function (app) {
    app.get('/', (request, response) => {
        response.render('index')
    })
}