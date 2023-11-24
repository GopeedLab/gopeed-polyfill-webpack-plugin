"use strict";

class Context {
	#vm;

	constructor() {
		this.#vm = __gopeed_create_vm();
	}

	eval(code) {
		for (const key in this) {
			this.#vm.set(key, this[key]);
		}
		const result = this.#vm.runString(code);
		for (const key in this) {
			this[key] = this.#vm.get(key);
		}
		return result;
	}
}

class Script {
	constructor(code) {
		this.code = code;
	}

	runInContext(context) {
		return context.eval(this.code);
	}

	runInNewContext(context) {
		const newCtx = exports.createContext(context);
		return exports.runInNewContext(this.code, newCtx);
	}

	runInThisContext() {
		return exports.runInThisContext(this.code);
	}
}

exports.runInThisContext = function (code) {
	return eval(code);
};

exports.createContext = function (contextObject) {
	var copy = new Context();
	if (typeof contextObject === "object") {
		for (const key in contextObject) {
			copy[key] = contextObject[key];
		}
	}
	return copy;
};

exports.runInNewContext = function (code, contextObject) {
	const context = exports.createContext(contextObject);
	return context.eval(code);
};

exports.Script = Script;
