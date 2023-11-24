# gopeed-polyfill-webpack-plugin

Polyfill Node.js core modules in Webpack.

This module is only needed for [Webpack 5+](https://github.com/webpack/changelog-v5#automatic-nodejs-polyfills-removed).

## Install

```sh
npm install gopeed-polyfill-webpack-plugin
```

## Usage

Add the following to your `webpack.config.js`:

```js
const GopeedPolyfillPlugin = require('gopeed-polyfill-webpack-plugin');

module.exports = {
	// Other rules...
	plugins: [
		new GopeedPolyfillPlugin()
	]
};
```

## API

### new GopeedPolyfillPlugin(options?)

#### options

Type: `object`

`excludeAliases` and `includeAliases` are mutually exclusive.

#### excludeAliases

By default, the modules that were polyfilled in Webpack 4 are mirrored over. However, if you don't want a module like `process` to be polyfilled you can specify alises to be skipped here.

```js
const GopeedPolyfillPlugin = require('gopeed-polyfill-webpack-plugin');

module.exports = {
	// Other rules...
	plugins: [
		new GopeedPolyfillPlugin({
			excludeAliases: ['process']
		})
	]
};
```

#### includeAliases

Alternatively, you can choose to only include certain aliases. For example, you can only have `process` polyfilled.

```js
const GopeedPolyfillPlugin = require('gopeed-polyfill-webpack-plugin');

module.exports = {
	// Other rules...
	plugins: [
		new GopeedPolyfillPlugin({
			includeAliases: ['process']
		})
	]
};
```

## Aliases

### Globals

- `Buffer`
- `process`

### Modules

- `assert`
- `buffer`
- `console`
- `constants`
- `crypto`
- `domain`
- `events`
- `http`
- `https`
- `os`
- `path`
- `punycode`
- `process`
- `querystring`
- `stream`
- `_stream_duplex`
- `_stream_passthrough`
- `_stream_readable`
- `_stream_transform`
- `_stream_writable`
- `string_decoder`
- `sys`
- `timers`
- `tty`
- `url`
- `util`
- `vm`
- `zlib`
