/**
 * Wrapper for localStorage
 * @type {{store: Function, restore: Function, clear: Function}}
 */
var Storage = {


	/**
	 * Restores an object from a stored array by
	 *
	 * @param key
	 * @param property
	 * @param identifier
	 */
	removeEntityObject: function(storeKey, property, object){
		var result = 0;
		var storedObjects = Storage.restore(storeKey);
		if(typeof storedObjects !== "undefined" && storedObjects instanceof Object){
			$.each(storedObjects, function( key, storedElement ) {
				if(storedElement[property] == object[property]){
					delete storedObjects[key];
					result = 1;
				}
			});
			Storage.store(storeKey, storedObjects);
		}
	},

	/**
	 * Restores an object from a stored array by
	 *
	 * @param key
	 * @param property
	 * @param identifier
	 */
	restoreEntityObjectByIdentifier: function(key, property, identifier){
		var object = null;
		var storedObjects = Storage.restore(key);
		if(typeof storedObjects !== "undefined" && storedObjects instanceof Object){
			$.each(storedObjects, function( key, storedElement ) {
				if(storedElement[property] == identifier){
					object = storedElement;
				}
			});
		}
		return object;
	},

	/**
	 * Stores an object in an array, if element is found by property's identifier, given object will
	 * replace old element in array
	 *
	 * @param key
	 * @param property
	 * @param object
	 */
	storeEntityObject: function(key, property, object){
		var result = 0;
		var storedObjects = Storage.restore(key);
		if(typeof storedObjects !== "undefined" && storedObjects instanceof Object){
			$.each(storedObjects, function( key, storedElement ) {
				if(storedElement[property] == object[property]){
					// ad object to original array
					storedObjects[key] = object;
					result = 1;
				}
			});
			if(result == 0){
				storedObjects[Object.keys(storedObjects).length] = object;
			}
		}else{
			storedObjects = {0: object};
		}
		Storage.store(key, storedObjects);
	},

	/**
	 * Stores data into the browser storage by key
	 * @param key
	 * @param data
	 */
	store: function (key, data){
		localStorage[key] = JSON.stringify(data);
	},

	/**
	 * Restores data from the browser storage by key
	 * @param key
	 * @param data
	 */
	restore: function(key){
		if(typeof localStorage[key] !== "undefined"){
			return JSON.parse(localStorage[key]);
		}else{
			return null;
		}
	},

	/**
	 * Clears the browser storage
	 */
	clear: function (){
		localStorage.clear();
	}
}