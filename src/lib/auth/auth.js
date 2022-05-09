const queryString = require('querystring')

const Auth = {
    github: function (clientid, clientsecret, scopes = [], callbackUri = false) {
        // Guard Clauses
        if (typeof clientid !== 'string') throw new Error('clientid must be a string')
        if (typeof clientsecret !== 'string') throw new Error('clientsecret must be a string')
        if (!Array.isArray(scopes)) throw new Error('scopes must be an array')

        // If scopes doesn't include 'user:email' add it
        if (!scopes.includes('user:email')) {
            scopes.push('user:email')
        }
        // If scopes doesn't include 'read:user' add it
        if (!scopes.includes('read:user')) {
            scopes.push('read:user')
        }

        const params = queryString.stringify({
            client_id: clientid,
            redirect_uri: callbackUri || `${location.protocol}//${location.host}/auth/github/callback`,
            scope: [...scopes].join(' '),
            allow_signup: true
        })
        const githubLoginUrl = `https://github.com/login/oauth/authorize?${params}`

        async function getAccessTokenFromCode(code) {
            const { data } = await axios({
                url: 'https://github.com/login/oauth/access_token',
                method: 'get',
                params: {
                    client_id: clientid,
                    client_secret: clientsecret,
                    redirect_uri: callbackUri || `${location.protocol}//${location.host}/auth/github/callback`,
                    code
                }
            })
            /**
             * GitHub returns data as a string we must parse.
             */
            const parsedData = queryString.parse(data)
            // { token_type, access_token, error, error_description }
            if (parsedData.error) throw new Error(parsedData.error_description)
            return parsedData.access_token
        }

        async function getGitHubUserData(access_token) {
            const { data } = await axios({
                url: 'https://api.github.com/user',
                method: 'get',
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
            // { id, email, name, login, avatar_url }
            return data
        }

        return async (req, res, next) => {
            if (req.url === '/auth/github') {
                return res.redirect(githubLoginUrl)
            }

            if (req.url.startsWith('/auth/github/callback')) {
                const code = req.query.code
                if (!code) return res.redirect('/')

                let accessToken = ''
                let githubUserData = {}

                try {
                    accessToken = await getAccessTokenFromCode(code)
                    githubUserData = await getGitHubUserData(accessToken)
                    if (!req.session.auth) req.session.auth = {}
                    req.session.auth.loggedin = true
                    req.session.auth.github = {
                        accessToken,
                        githubUserData
                    }
                    req.session.auth.username = githubUserData.login
                    req.session.auth.avatar = githubUserData.avatar_url
                    req.session.auth.email = githubUserData.email
                    req.session.auth.name = githubUserData.name || githubUserData.login

                    return res.redirect('/')
                } catch (err) {
                    return res.redirect('/')
                }
            }

            next()
        }
    }
}

module.exports = Auth