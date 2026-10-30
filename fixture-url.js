// Deliberately exercise module exports, including the supported legacy API.
/* eslint-disable unicorn/prefer-node-protocol, n/prefer-global/url, n/prefer-global/url-search-params, n/no-deprecated-api */
export {default, URL, URLSearchParams, parse, fileURLToPath} from 'url';
export {URL as NodeURL, URLSearchParams as NodeURLSearchParams} from 'node:url';
