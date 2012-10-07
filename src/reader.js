var fromCharCode = String.fromCharCode

var offset

function read (packet) {
    var k, l = 0, value

    switch (packet[offset++]) {
      case 0:
      case 1:
        return !!packet[offset - 1]
      case 2:
        return packet[offset++]
      case 3:
        if (packet[offset] === 1) {
          k = fromCharCode(packet[offset + 1])
          offset += 2
          return k
        }
        return fromCharCode.apply(String, [].slice.call(packet, offset + 1, offset = offset + 1 + packet[offset]))
      case 4:
        k = packet[offset++]
        value = []
        while (k--) {
          value[l++] = read(packet)
        }
        return value
      case 5:
        k = packet[offset++]
        value = {}
        while (k--) {
          value[read(packet)] = read(packet)
        }
        return value
    }
  }

exports.read = function (packet, _offset) {
  offset = _offset
  var i = 0, length = packet[offset++], j = 0, args = []
  
  for (; i < length; i++) {
    args[j++] = read(packet)
  }
  return args
}