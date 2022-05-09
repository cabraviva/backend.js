// Throw Error if window isn't defined
if (!window) throw new Error('window is not defined')

// Import packages
const path = require('path')
const vexpress = require('./vexpress/vexpr')

// Create "expres" like app
const app = vexpress()

// Start router
const router = require('./lib/router/router.js')
app.setRouter(router)
router.setApp(app)

// Session
require('./lib/session.js')

// On load
window.addEventListener('DOMContentLoaded', () => {
    // Set Route to current location
    router.setRoute(window.location.pathname)
})

// ############################### Export to browser ###############################
// Export default node packages
window.path = path

// Export simulated "express" app to browser
window.app = app

// Export router as $router to browser
window.$router = router