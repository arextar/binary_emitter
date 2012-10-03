var fromCharCode = String.fromCharCode

exports.read = function (packet, offset) {
  var i = 0, length = packet[offset++], j = 0, args = []
  function read () {
    var k, l = 0, value

    switch (packet[offset++]) {
      case 0:
      case 1:
        return !!packet[offset - 1]
      case 2:
        return packet[offset++]
      case 3:
        return fromCharCode.apply(String, [].slice.call(packet, offset + 1, offset = offset + 1 + packet[offset]))
      case 4:
        k = packet[offset++]
        value = []
        while (k--) {
          value[l++] = read()
        }
        return value
      case 5:
        k = packet[offset++]
        value = {}
        while (k--) {
          value[read()] = read()
        }
        return value
    }
  }
  for (; i < length; i++) {
    args[j++] = read()
  }
  return args
}