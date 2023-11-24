const fs = require('node:fs');
const test = require('ava');
const webpack = require('p-webpack');
const GopeedPolyfillPlugin = require('./index.js');

test('main', async t => {
	await webpack({
		entry: './fixture',
		output: {
			library: {
				type: 'commonjs-module',
			},
			filename: '1.js',
		},
		plugins: [
			new GopeedPolyfillPlugin({
				excludeAliases: ['console'],
			}),
		],
	});

	t.is(require('./dist/1.js'), 'Hello World');

	// https://github.com/browserify/console-browserify/blob/f7eefc7c908c29d2e94954e5c6c1098e8c1028b4/index.js#L63
	t.false(fs.readFileSync('./dist/1.js').toString().includes('No such label: '));

	// https://github.com/feross/buffer/blob/master/index.js#L80
	t.true(fs.readFileSync('./dist/1.js').toString().includes('is invalid for option "size"'));
});

test('includeAliases', async t => {
	await webpack({
		entry: './fixture',
		output: {
			library: {
				type: 'commonjs-module',
			},
			filename: '2.js',
		},
		plugins: [
			new GopeedPolyfillPlugin({
				includeAliases: ['console'],
			}),
		],
	});

	t.is(require('./dist/2.js'), 'Hello World');

	// https://github.com/browserify/console-browserify/blob/f7eefc7c908c29d2e94954e5c6c1098e8c1028b4/index.js#L63
	t.true(fs.readFileSync('./dist/2.js').toString().includes('No such label: '));

	// https://github.com/feross/buffer/blob/master/index.js#L80
	t.false(fs.readFileSync('./dist/2.js').toString().includes('is invalid for option "size"'));
});

test('includeAliases and excludeAliases used at the same time', t => {
	t.throws(() => new GopeedPolyfillPlugin({
		includeAliases: ['console'],
		excludeAliases: ['crypto'],
	}), {instanceOf: Error});
});
