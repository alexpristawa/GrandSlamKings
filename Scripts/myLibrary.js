/**
 * Returns a random integer
 * @param {int} min (inclusive) - Minimum random number
 * @param {int} max (exclusive) - Maximum random number
 * @returns 
 */
let randomNumber = (min, max) => {
    return Math.floor(Math.random()*(max-min)+min);
}

/**
 * Numerically inserts an element into an array
 * @param {any} element - Thing you want to numerically insert into an array
 * @param {String} key (Optional) - Inserts it numerically based on a key if it is an array of objects
 */
Array.prototype.numericInsert = function(element, key = false) {
    // Find the correct position for the new element
    let i = 0;
    if(!key) { //Array of numbers
        while (i < this.length && this[i] < element) {
            i++;
        }
    } else { //Array of objects
        while (i < this.length && this[i][key] < element[key]) {
            i++;
        }
    }

    // Insert the element at the found position
    this.splice(i, 0, element);
};

/**
 * Gets the index of an object in an array of objects that has a `value` property associated with the `key`
 * @param {String} key - Key in the object you want to search for
 * @param {any} value - Value associated with the key
 * @returns 
 */
Array.prototype.indexOfObjectValue = function(key, value) {
    for(let i = 0; i < this.length; i++) {
        if(this[i][key] == value) {
            return i;
        }
    }
    return -1;
}

/**
 * Makes a delay in an async function
 * @param {number} ms - Millisecond delay 
 * @returns after the `ms` period of time
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Applies any amount of styles to an element
 * @param {Object} obj - Object of styles you want to apply with key styleName (ex: {fontSize: '2px'});
 */
HTMLElement.prototype.applyStyles = function(obj) {
    Object.keys(obj).forEach(key => {
        obj.style[key] = obj[key];
    });
}

/**
 * Gets the key of an object based on the value
 * @param {Object} obj - Object
 * @param {any} value - Value
 * @returns {String} key - Key of the object that has the value
 */
let getKeyByValue = (obj, value) => {
    return Object.keys(obj).find(key => obj[key] === value);
}
