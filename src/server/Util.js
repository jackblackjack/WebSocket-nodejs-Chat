/**
 * Utility class with some helpers
 */
var U = {
	log: function(text){
		$('#log').prepend(text +'\n');
	},
	htmlEntities: function(string) {
		return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
}

/**
 * Add to Object method to JavaScript Array class
 * @returns {{}}
 */
Array.prototype.toObject = function() {
	var object = {};
	for (var i = 0; i < this.length; ++i)
		object[i] = this[i];
	return object;
}