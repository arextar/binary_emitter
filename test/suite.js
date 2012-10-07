var fails = 0


function assert (pass, message) {
	if (!pass) console.log('Failed:', message), fails++
}

// Parser
var writer = require('../src/writer'), reader = require('../src/reader')

var objects = [
	1,
	true,
	false,
	'a',
	'asdf',

	[],
	[1, 2, 3],
	[true, false, false, true],
	['a', 'b', 'c'],
	['Hello', ' ', 'World', '!'],

	{},
	{a: 1, b: 2, c: 3},
	{a: true, b: true, c: false},
	{a: 'a', b: 'b', c: 'c'},
	{a: 'Hello ', b: 'World!'},
	{foo: 'bar'}
], buf = new Buffer(500)

objects.forEach(function (obj) {
	var str = JSON.stringify(obj)
	writer.write([obj], buf, 0)
	assert(JSON.stringify(reader.read(buf, 0)[0]) === str, str)
})

assert(true, 'asdf')

if (!fails) console.log('All tests passed!')