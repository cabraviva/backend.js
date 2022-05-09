// Change the URL without reloading the page
function isAbsoluteUrl(url) {
    return /^[a-z][a-z0-9+.-]*:/.test(url);
}

module.exports = function (newUrl) {
    if (!isAbsoluteUrl(newUrl)) return window.history.pushState({}, '', newUrl + location.search)
    window.location = newUrl
    return '::EXTERNAL_URL'
}