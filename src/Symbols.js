function Symbols () {
  this.incoming = {}
  this.outgoing = {}
  this.uid = 0
}

Symbols.prototype = {
  add: function (name) {
    if (this.outgoing.hasOwnProperty(name)) return this.outgoing[name]
    return this.outgoing[name] = this.uid++
  },
  
  define: function (name, id) {
    this.incoming[id] = name
  }
}

exports.Symbols = Symbols