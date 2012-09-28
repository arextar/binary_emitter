function len (value) {
  switch (typeof value) {
    case 'number':
      return 2
    break;
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
  
  function write (val) {
    switch (typeof val) {
      case 'number':
        packet[offset++] = 1
        packet[offset++] = val
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