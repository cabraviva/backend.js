// Starts a server on port 3000 which serves the file z-page.html, and dist/bundle.js
const http = require('http')
const fs = require('fs')
http.createServer(async (req, res) => {
    if (req.url === '/dist/bundle.js') { res.writeHead(200, { 'Content-Type': 'application/javascript' }); return res.end(fs.readFileSync('./dist/browserfied.js').toString('utf8')) }
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end((await fs.promises.readFile('./z-page.html', 'utf8')).toString('utf8'))
}).listen(3000, () => {
    console.log('Server running on port 3000')
})