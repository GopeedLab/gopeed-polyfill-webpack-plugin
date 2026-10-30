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

for (const mode of ['development', 'production']) {
	test(`URL exports (${mode})`, async t => {
		await webpack({
			mode,
			entry: './fixture-url.js',
			output: {
				library: {type: 'commonjs-module'},
				filename: `url-${mode}.js`,
			},
			plugins: [new GopeedPolyfillPlugin({includeAliases: ['url']})],
		});

		const url = require(`./dist/url-${mode}.js`);
		t.is(url.URL, globalThis.URL);
		t.is(url.NodeURL, globalThis.URL);
		t.is(url.URLSearchParams, globalThis.URLSearchParams);
		t.is(url.NodeURLSearchParams, globalThis.URLSearchParams);
		t.is(url.default.URL, globalThis.URL);
		t.is(new url.URL('/video', 'https://example.com').href, 'https://example.com/video');
		t.is(new url.URLSearchParams('p=2').get('p'), '2');
		t.is(url.parse('https://example.com/video').hostname, 'example.com');
		t.is(url.fileURLToPath('file:///tmp/video.mp4'), '/tmp/video.mp4');
	});
}

for (const options of [{excludeAliases: ['url']}, {includeAliases: ['process']}]) {
	test(`URL polyfill disabled by ${Object.keys(options)[0]}`, async t => {
		const filename = `url-disabled-${Object.keys(options)[0]}.js`;
		await webpack({
			mode: 'development',
			entry: './fixture-url.js',
			output: {
				library: {type: 'commonjs-module'},
				filename,
			},
			plugins: [new GopeedPolyfillPlugin(options)],
		});
		const url = require(`./dist/${filename}`);
		t.is(url.URL, undefined);
		t.is(url.NodeURL, undefined);
		t.is(url.parse('https://example.com/video').hostname, 'example.com');
	});
}
