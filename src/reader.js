var fromCharCode = String.fromCharCode

exports.read = function (packet, offset) {
  var i = 0, len = packet[offset++], j = 0, args = []
  function read () {
    switch (packet[offset++]) {
      case 0:
      case 1:
        return !!packet[offset - 1]
      case 2:
        return packet[offset++]
      case 3:
        return fromCharCode.apply(String, [].slice.call(packet, offset + 1, offset + 1 + packet[offset]))
    }
  }
  for (; i < len; i++) {
    args[j++] = read()
  }
  return args
}