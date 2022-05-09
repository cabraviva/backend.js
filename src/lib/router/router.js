const changeURL = require('./changeUrl')

class Router {
    constructor () {
        
    }

    _setUrl (url) {
        return changeURL(url)
    }

    setRoute (routePath) {
        if (this._setUrl(routePath) === '::EXTERNAL_URL') return
        this.$app.triggerRoute(routePath)
    }

    setApp (app) {
        this.$app = app
    }
}

const router = new Router()

// Make every a tag in the page trigger the router
function linkRouterHandler () {
    const links = document.querySelectorAll('a')
    for (const link of links) {
        link.addEventListener('click', ($event) => {
            $event.preventDefault()
            const href = link.getAttribute('href')
            if (href === '#') return
            router.setRoute(href)
        })
    }
}
setInterval(linkRouterHandler, 1000)

// Set title from body
setInterval(function () {
    const bodyTitles = document.querySelectorAll('body title')
    let headTitle = document.querySelector('head title')
    if (!headTitle) {
        headTitle = document.createElement('title')
        document.querySelector('head').appendChild(headTitle)
    }

    for (const bodyTitle of bodyTitles) {
        headTitle.innerHTML = bodyTitle.innerHTML
        bodyTitle.remove()
    }
}, 20)

module.exports = router