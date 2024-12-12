/**
 * Gets the x-coordinate of an element on the page
 * @param {HTMLElement} relative - Element you want `this`s x-coordinate relative to
 * @returns {number} - x-coordinate of the element
 */
HTMLElement.prototype.getX = function(relative = undefined) {
    if(relative !== undefined) {
        return this.getBoundingClientRect().left - relative.getBoundingClientRect().left;
    }
    return this.getBoundingClientRect().left;
}

/**
 * Gets the y-coordinate of an element on the page
 * @param {HTMLElement} relative - Element you want `this`s y-coordinate relative to
 * @returns {number} - y-coordinate of the element
 */
HTMLElement.prototype.getY = function(relative = undefined) {
    if(relative !== undefined) {
        return this.getBoundingClientRect().top - relative.getBoundingClientRect().top;
    }
    return this.getBoundingClientRect().top;
}

/**
 * Gets the y-coordinate of an element based on the bottom of the page
 * @param {HTMLElement} relative - Element you want `this`s y-coordinate relative to
 * @returns {number} - y-coordinate of the element based on the bottom of the page
 */
HTMLElement.prototype.getYB = function(relative = undefined) {
    if(relative !== undefined) {
        return relative.getBoundingClientRect().bottom - this.getBoundingClientRect().bottom;
    }
    return this.getBoundingClientRect().bottom;
}