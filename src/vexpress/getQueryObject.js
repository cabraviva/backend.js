module.exports = function () {
    const querystring = require('querystring')
    const qs = window.location.search.substring(1)
    const qsObj = querystring.parse(qs)
    return qsObj
}