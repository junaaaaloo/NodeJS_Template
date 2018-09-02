/* LIBRARIES */
let session = require('express-session')
let parser = require('body-parser')
let express = require('express')
let path = require('path')
let fs = require('fs')

/* MODULES */
let logger = require('./logs/logger')

/* CONFIGURATION VALUES */
let CONFIG_VALUES = require('./config/config_values')

let app = express()

/* SERVER SETUP */
app.set('port', process.env.PORT || CONFIG_VALUES.server.port)
app.set('views', __dirname + CONFIG_VALUES.dir.views)
app.use(express.static(path.join(__dirname, CONFIG_VALUES.dir.public)))
app.set('view engine', 'hbs')

app.use(parser.json())
app.use(parser.urlencoded({ extended: true }));
app.use(session({ 
    secret: CONFIG_VALUES.session.key,
    resave: true,
    saveUninitialized: true
 }))

app.use(function(request, response, next) {
    response.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    next()
})

fs.readdirSync(path.join(__dirname, CONFIG_VALUES.dir.controllers)).forEach(function(file) {
    if(file.substr(-3) == '.js') {
        route = require('.' + CONFIG_VALUES.dir.controllers + '/' + file)
        route.controller(app)
    }
})

logger.add({
    "log": function (timestamp, tag, message) { 
        console.log("[" + timestamp + "|" + tag + "] " + message)
    }
})

logger.add({
    "log": function(timestamp, tag, message) {
        let fileName = CONFIG_VALUES.dir.logs + "/" + timestamp.split(" ")[0] + ".log";
        fs.appendFileSync(fileName, "[" + timestamp + "|" + tag + "] " + message + "\n")
    }
})

/* START SERVER */
app.listen(app.get('port'), function(){
    logger.relayMessage('SERVER', 'Server has started')
    logger.relayMessage('SERVER', 'Server running at ' + CONFIG_VALUES.server.host + ":" + CONFIG_VALUES.server.port)
})

process.on('exit', (code) => {
    logger.relayMessage('SERVER', 'Server has stopped')
})

process.on('SIGINT', (code) => {
    logger.relayMessage('SERVER', 'Server was forcefully shutdown')
    process.exit(1)
})