var net = require('net')
var bin_emitter = require('./src')

var sock = net.connect(1339)
var em = bin_emitter.wrap(sock)

setInterval(function () {
  em.emit('sum', 5, 12, 13)
}, 1000)

em.on('res', function (n) {
  console.log('Response:', n)
})