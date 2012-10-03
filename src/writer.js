function len (value) {
  var x, length
  switch (typeof value) {
    case 'number':
      return 2
    case 'boolean':
      return 1
    case 'string':
      return value.length + 2
    case 'object':
      if ({}.toString.call(value) === '[object Array]') {
        length = 2
        for (x = 0; x < value.length; x++) {
          length += len(value[x])
        }
        return length
      }
      else
      {
        length = 2
        for (x in value) {
          if (value.hasOwnProperty(x)) {
            length += len(x) + len(value[x])
          }
        }
        return length
      }
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
    var j, length, index

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
        for (j = 0; j < value.length; j++) {
          packet[offset++] = value.charCodeAt(j)
        }
      break;
      case 'object':
        if ({}.toString.call(value) === '[object Array]') {
          packet[offset++] = 4
          packet[offset++] = value.length
          for (j = 0; j < value.length; j++) {
            write(value[j])
          }
        }
        else
        {
          packet[offset++] = 5
          index = offset++
          length = 0
          for (j in value) {
            if (value.hasOwnProperty(j)) {
              write(j)
              write(value[j])
              length++
            }
          }
          packet[index] = length
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