function something() {}

function testFunc(command: 'up' | 'down') {
	return {
		up: something,
		down: something,
	}[command];
}
