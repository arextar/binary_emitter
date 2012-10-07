var reader = require('./reader')
var Data = require('./data').Data

function Socket (emit) {
  this.symbols = new (require('./Symbols').Symbols)
  this.waiting = {}
}

/*
 Packet types:
  1 - Emit event
  2 - Name event
  3 - 
  4 - 
  5 - 
*/

var fromCharCode = String.fromCharCode, slice = [].slice

Socket.prototype = {
  // Handle a list of packets prefixed by their length
  handlePacket: function (packs) {
    var i = 0
    
    while (i < packs.length) {
      this.handlePacket_(packs, i + 1, packs[i])
      i += packs[i] + 1
    }
  },
  
  
  handlePacket_: function (packet, offset, length) {
    var id, i
    
    switch (packet[offset]) {
      // Emit an event
      case 1:
        this.emit(packet[offset + 1], packet, offset)
      break;
      
      // Add a sent symbol to the symbols object, triggering any events that did not previously have a symbol
      case 2:
        this.symbols.define(fromCharCode.apply(String, slice.call(packet, offset + 2, offset + 2 + length)), id = packet[offset + 1])
        if (this.waiting.hasOwnProperty(id) && this.waiting[id].length) {
          for (i = 0; i < this.waiting[id].length; i++) {
            this.emit(id, this.waiting[id][i])
          }
          this.waiting[id].length = 0
        }
      break;
    }
  },
  
  
  emit: function (type, packet, offset) {
    var incoming = this.symbols.incoming
    
    if (!incoming.hasOwnProperty(type)) {
      /*if (this.waiting.hasOwnProperty(type)) this.waiting[type].push(packet)
      else this.waiting[type] = [packet]
      return;*/
    }
    var name = incoming[type]
    
    // Pass to the emitter
    this.emit_(name, reader.read(packet, offset + 2))
  },
  
  
  // Gets an outgoing symbol's id by name, adding it if needed
  getSymbol: function (name) {
    this.addSymbol(name)
    return this.symbols.outgoing[name]
  },
  
  
  // Register a named, outgoing symbol, giving it a unique id and sending it to the other client
  addSymbol: function (name) {
    var id, pack, i
    
    if (!this.symbols.outgoing.hasOwnProperty(name)) {
      pack = new Data(3 + name.length)
      pack[0] = 2 + name.length
      pack[1] = 2
      pack[2] = id = this.symbols.add(name)
      for (i = 0; i < name.length; i++) {
        pack[3 + i] = name.charCodeAt(i)
      }
      this.send(pack)
      return id
    }
    return this.symbols.add(name)
  }
}

exports.Socket = Socket