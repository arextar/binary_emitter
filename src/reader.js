exports.read = function (packet, offset) {
  var i = 0, len = packet[offset++], j = 0, args = []
  
  function read () {
    switch (packet[offset++]) {
      case 1:
        return packet[offset++]
      break;
    }
  }
  for (; i < len; i++) {
    args[j++] = read()
  }
  return args
}