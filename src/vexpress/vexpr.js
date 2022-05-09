class VirtualExpressApp {
    constructor () {

    }

    setRouter (router) {
        this.$router = router
    }
}

module.exports = function () {
    return new VirtualExpressApp()
}