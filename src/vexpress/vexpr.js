const getQueryObject = require('./getQueryObject')

function removeSlashesAtEnd (string) {
    while (string.endsWith('/')) {
        string = string.slice(0, -1)
    }

    return string
}

function getReq (requestType, routePath, app) {
    let req = {
        method: requestType,
        url: removeSlashesAtEnd(routePath) === '' ? '/' : removeSlashesAtEnd(routePath),
        headers: {
            cookie: document.cookie
        },
        body: {},
        params: {},
        query: getQueryObject(),
        session: window.session,
        getApp: () => app
    }
    req.cookies = (function parseAndGetCookies() {
        const cookies = {}
        const cookieString = req.headers.cookie
        if (!cookieString) return cookies

        for (let cookiePair of cookieString.split(';')) {
            cookiePair = cookiePair.trim()
            const cookiePairSplit = cookiePair.split('=')
            const key = cookiePairSplit[0]
            const value = decodeURIComponent(cookiePairSplit[1])
            cookies[key] = value
        }

        return cookies
    })();

    return req
}

function getRes (requestType, routePath, app) {
    let res = {
        status: (code) => {
            // TODO: Implement status code
        },
        $clearOut: () => {
            document.querySelector('body').innerHTML = ''
        },
        send: (data) => {
            document.querySelector('body').innerHTML += data
        },
        redirect: (url) => {
            this.$router.setRoute(url)
        },
        cookie(name, value) {
            document.cookie = `${name}=${encodeURIComponent(value)};`
            // After setting a cookie the request object has to be renewed
            app.$req = getReq(requestType, routePath, app)
        }
    }
    res.end = res.send

    return res
}

class VirtualExpressApp {
    constructor () {
        this.$middlewares = []

        let requestType = 'get'
        const req = getReq(requestType, window.location.pathname, this)
        const res = getRes(requestType, window.location.pathname, this)
        this.$req = req
        this.$res = res
    }

    setRouter (router) {
        this.$router = router
    }

    runMW (middleware, request, response) {
        return new Promise((resolve, reject) => {
            middleware(request, response, resolve)
        })
    }

    async triggerRoute (routePath) {
        const requestType = 'get'

        // Define request and response objects
        let req = getReq(requestType, routePath, this)
        let res = getRes(requestType, routePath, this)

        // Set req & res to app
        this.$req = req
        this.$res = res
        
        // Run middlewares
        let localMiddlewares = [...this.$middlewares]

        for (const middleware of localMiddlewares) {
            await this.runMW(middleware, req, res)
        }

        // No middleware found
        // Display 404
        res.$clearOut()
        res.end(`Cannot get ${req.url}`)
    }

    addRoute (requestType, routePath, handler) {
        this.use((req, res, next) => {
            if (req.url.toLowerCase() === routePath.toLowerCase() && req.method.toLowerCase() === requestType.toLowerCase()) {
                res.$clearOut()
                handler(req, res)
            } else {
                next()
            }
        })
    }

    use (middleware) {
        this.$middlewares.push(middleware)
    }

    get (routePath, handler) {
        this.addRoute('get', routePath, handler)
    }

    post (routePath, handler) {
        this.addRoute('post', routePath, handler)
    }
}

module.exports = function () {
    return new VirtualExpressApp()
}