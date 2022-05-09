// Throw Error if window isn't defined
if (!window) throw new Error('window is not defined')

// Import packages
const path = require('path')
const axios = require('axios')
const http = require('http')
const https = require('https')
const fs = require('fs')
const vexpress = require('./vexpress/vexpr')

// Create "expres" like app
const app = vexpress()

// Start router
const router = require('./lib/router/router.js')
app.setRouter(router)
router.setApp(app)

app.get('/auth/logout', (req, res) => {
    req.session.auth = {
        loggedin: false
    }
})

// Session
require('./lib/session.js')
if (!session.auth) session.auth = { loggedin: false }

// On load
window.addEventListener('DOMContentLoaded', () => {
    // Set Route to current location
    router.setRoute(window.location.pathname)
})

// ############################### Export to browser ###############################
// Export default node packages
window.path = path
window.axios = axios
window.http = http
window.https = https

// Export simulated "express" app to browser
window.app = app

// Export Auth module
window.Auth = require('./lib/auth/auth.js')

// Export router as $router to browser
window.$router = router