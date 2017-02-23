import Ember from 'ember';

const HF = Ember.Object.extend({
	// Return a shallow copy of an object. Sub-objects (and sub-arrays) are not cloned. (uses extend internally)
	clone(obj) {
		return this.extend({},obj);
	},
	// Basic detection method, returns the first instance where the
	// iterator returns truthy.
	detect(obj, iterator, context, arg1, arg2) {
		var result;
		if (obj == null) { return; }
		if (obj.length === +obj.length) {
			for (var i = 0, l = obj.length; i < l; i++) {
				result = iterator.call(context, obj[i], i, arg1,arg2);
				if(result) { return result; }
			}
			return false;
		} else {
			for (var key in obj) {
				result = iterator.call(context, obj[key], key, arg1,arg2);
				if(result) { return result; }
			}
			return false;
		}
	},

	each(obj, iterator, context) {
		if (obj == null) { return; }
		if (obj.forEach) {
			obj.forEach(iterator,context);
		} else if (obj.length === +obj.length) {
			for (var i = 0, l = obj.length; i < l; i++) {
				iterator.call(context, obj[i], i, obj);
			}
		} else {
			for (var key in obj) {
				iterator.call(context, obj[key], key, obj);
			}
		}
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
	/**
  		Return the file extension of a filename
	*/
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

	keys(obj) {
		if(Ember.typeOf(obj) !== 'object') {
			throw new TypeError('Invalid object');
		}
		var keys = [];
		for (var key in obj) {
			if (this.has(obj, key)) {
				keys[keys.length] = key;
			}
		}
		return keys;
	},
	// Removes a property from an object and returns it if it exists
	popProperty(obj,property) {
		var val = obj[property];
		delete obj[property];
		return val;
	},

	removeExtension(filename) {
		if(this.isString(filename)) {
			return filename.replace(/\.(\w{3,4})$/,"");
		}
		else {
			console.error( 'EORROR: filename is not of type String\n filename: ', filename);
			return "";
		}
	},
});

export default HF.create();
