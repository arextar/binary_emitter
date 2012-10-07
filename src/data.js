function Data (len) {
	var arr, ret
	if (typeof Buffer === 'undefined') {
		arr = new ArrayBuffer(len)
		ret = new Uint8Array(arr)

		return ret
	}
	return new Buffer(len)
}

exports.Data = Data