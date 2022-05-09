// Import packages
const path = require('path')
const vexpress = require('./vexpress/vexpr')

// Create "expres" like app
const app = vexpress()

// Start router
const router = require('./lib/router/router.js')
app.setRouter(router)
router.setApp(app)

// Export to browser
if (window) {
    // Export default node packages
    window.path = path

    // Export simulated "express" app to browser
    window.app = app

    // Export router as $router to browser
    window.$router = router
} else {
    throw new Error('window is not defined')
}