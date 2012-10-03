var net = require('net')
var bin_emitter = require('./src')

var server = net.createServer(function (sock) {
  var em = bin_emitter.wrap(sock)
  
  em.on('sum', function (o, unit) {
    console.log(o)
    em.emit('res', o.a + o.b + o.c, unit)
  })
})

server.listen(1339)