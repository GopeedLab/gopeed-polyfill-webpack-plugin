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
				excludeAliases: ['process'],
			}),
		],
	});

	t.is(require('./dist/1.js'), 'Hello World');

	// https://github.com/defunctzombie/node-process/blob/77caa43cdaee4ea710aa14d11cea1705293c0ef3/browser.js#L16C8-L16C9
	t.false(fs.readFileSync('./dist/1.js').toString().includes('clearTimeout has not been defined'));

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
				includeAliases: ['process'],
			}),
		],
	});

	t.is(require('./dist/2.js'), 'Hello World');

	// https://github.com/defunctzombie/node-process/blob/77caa43cdaee4ea710aa14d11cea1705293c0ef3/browser.js#L16C8-L16C9
	t.true(fs.readFileSync('./dist/2.js').toString().includes('clearTimeout has not been defined'));

	// https://github.com/feross/buffer/blob/master/index.js#L80
	t.false(fs.readFileSync('./dist/2.js').toString().includes('is invalid for option "size"'));
});

test('includeAliases and excludeAliases used at the same time', t => {
	t.throws(() => new GopeedPolyfillPlugin({
		includeAliases: ['process'],
		excludeAliases: ['crypto'],
	}), {instanceOf: Error});
});
