var net = require('net')
var bin_emitter = require('./src')

var server = net.createServer(function (sock) {
  var em = bin_emitter.wrap(sock)
  
  em.on('sum', function (a, b, c) {
    console.log(a, b, c)
    em.emit('res', a + b + c)
  })
})

server.listen(1339)