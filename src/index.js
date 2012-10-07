var Socket = exports.Socket = require('./Socket').Socket
var Emitter = exports.Emitter = require('./Emitter').Emitter

exports.wrap = function (socket) {
  if ({}.toString.call(socket) === '[object WebSocket]') {
    socket.binaryType = 'arraybuffer'
    var sock = new Socket()
    
    sock.send = function (packet) {
      socket.send(packet.buffer)
    }
    
    socket.onmessage = function (e) {
      sock.handlePacket(new Uint8Array(e.data))
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