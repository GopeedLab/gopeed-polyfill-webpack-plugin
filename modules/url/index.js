'use strict';

module.exports = {
	// Use the file path to avoid resolving back through the url alias.
	...require('url/url.js'),
	URL: globalThis.URL,
	URLSearchParams: globalThis.URLSearchParams,
};
