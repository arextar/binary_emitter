var Socket = require('./Socket').Socket
var Emitter = require('./Emitter').Emitter

exports.wrap = function (socket) {
  if ({}.toString.call(socket) === '[object WebSocket]') {
    socket.binaryType = 'typedarray'
    var sock = new Socket()
    
    sock.send = function (packet) {
      socket.send(packet)
    }
    
    socket.onmessage = function (e) {
      sock.handlePacket(e.data)
    }
    
    return new Emitter(sock)
  }
  else if (socket.constructor.name === 'Socket') {
    var sock = new Socket()
    
    sock.send = function (packet) {
      socket.write(packet)
    }
    
    socket.on('data', function (chunk) {
      sock.handlePacket(chunk)
    })
    
    return new Emitter(sock)
  }
}