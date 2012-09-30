function len (value) {
  switch (typeof value) {
    case 'number':
      return 2
    case 'boolean':
      return 1
    case 'string':
      return value.length + 2
  }
}

exports.measure = function (args) {
  var i

  if (args.length === 0) return 0
  
  for (i = 0, length = 1; i < args.length; i++) {
    length += len(args[i])
  }
  return length
}

exports.write = function (args, packet, offset) {
  var i
  
  function write (value) {
    var i
    switch (typeof value) {
      case 'number':
        packet[offset++] = 2
        packet[offset++] = value
      break;
      case 'boolean':
        packet[offset++] = +value
      break;
      case 'string':
        packet[offset++] = 3
        packet[offset++] = value.length
        for (i = 0; i < value.length; i++) {
          packet[offset++] = value.charCodeAt(i)
        }
      break;
    }
  }
  
  if (args.length === 0) return
  
  packet[offset++] = args.length
  for (i = 0; i < args.length; i++) {
    write(args[i])
  }
}

// Create a packet (an 'emit' one) to send with given arguments and type
exports.createPacket = function (args, type) {
  var packet = new Buffer(exports.measure(args) + 3)

  packet[0] = packet.length - 1
  packet[1] = 1
  packet[2] = type
  exports.write(args, packet, 3)
  return packet
}