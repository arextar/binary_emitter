var net = require('net')
var bin_emitter = require('./src')

var sock = net.connect(1339)
var em = bin_emitter.wrap(sock)

setInterval(function () {
  em.emit('sum', {a: 5, b: 12, c: 13}, 'in')
}, 1000)

em.on('res', function (n, unit) {
  console.log('Response:', n, unit)
})