import ENV from  '../config/environment';
import Ember from 'ember';

const HF = Ember.Object.extend({
	// Either return an absolute URL, or add a base to a relative URL
	assetUrl(self, base, url) {
		var timestamp = "";
		if(ENV.environment === 'development') {
			timestamp = (/\?/.test(url) ? "&" : "?") + "_t=" + new Date().getTime();
		}
		if(/^https?:\/\//.test(url) || url[0] === "/") {
			return url + timestamp;
		}
		else {
			return base + url + timestamp;
		}
	},
	// Return a shallow copy of an object. Sub-objects (and sub-arrays) are not cloned. (uses extend internally)
	clone(obj) {
		return this.extend({},obj);
	},
	// Extends a destination object with a source object (modifies destination object)
	extend(dest,source) {
		if(!source) {
			return dest;
		}
		for (var prop in source) {
			dest[prop] = source[prop];
		}
		return dest;
	},

	fileExtension(filename) {
	   var fileParts = filename.split("."),
			fileExt = fileParts[fileParts.length-1].toLowerCase();
	   return fileExt;
	},

	has(obj, key) {
		return Object.prototype.hasOwnProperty.call(obj, key);
	},

	isFunction(func) {
		return Ember.typeOf(func) === 'function';
	},

	isObject(object) {
		return Ember.typeOf(object) === 'object';
	},

	isString(scene) {
		return Ember.typeOf(scene) === 'string';
	},
	// Check if something is undefined
	isUndefined(obj) {
		return obj === void 0;
	},
	// Removes a property from an object and returns it if it exists
	popProperty(obj,property) {
		var val = obj[property];
		delete obj[property];
		return val;
	},

	removeExtension(filename) {
		return filename.replace(/\.(\w{3,4})$/,"");
	},
});

export default HF.create();
