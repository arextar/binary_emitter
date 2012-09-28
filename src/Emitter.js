var writer = require('./writer')

function Emitter (socket) {
  var that = this
  socket.emit_ = function (name, args) {
    that.emit_(name, args)
  }
  this.socket = socket
  
  this.handlers = {}
}

Emitter.prototype = {
  emit_: function (name, args) {
    var handlers = this.handlers, i
    
    if (handlers.hasOwnProperty(name)) {
      if (typeof handlers[name] === 'function') handlers[name].apply(this, args)
      else {
        handlers = handlers[name]
        for (i = 0; i < handlers.length; i++) handlers[i].apply(this, args)
      }
    }
  },
  
  emit: function (type) {
    var args = [].slice.call(arguments, 1)
    
    this.socket.send(writer.createPacket(args, this.socket.getSymbol(type)))
  },
  
  on: function (name, handler) {
    var handlers = this.handlers
    
    if (handlers.hasOwnProperty(name)) {
      if (typeof handlers[name] === 'function') handlers[name] = [handlers[name], handler]
      else handlers.push(handler)
    }
    else
    {
      handlers[name] = handler
    }
  },
  
  off: function (name, handler) {
    var handlers = this.handlers
    
    if (handler == null) {
      if (typeof handlers[name] === 'function') undefined
      else handlers[name].length = 0
    }
  }
}

exports.Emitter = Emitter