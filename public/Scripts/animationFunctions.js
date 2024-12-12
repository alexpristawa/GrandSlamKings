/**
 * Makes an element fade out, and sets its display to none (unless second parameter is not a boolean)
 * @param {number} ms - Milliseconds you want the animation to last
 * @param {boolean} remove - Whether or not you want it to be removed (Make it a different datatype for the display to not become none)
 */
HTMLElement.prototype.fadeOut = function(ms = 500, remove = true) {
    // Set the transition duration to the provided duration (or default to 500ms)
    this.style.transition = `opacity ${ms}ms`;
    
    // Start the fade out
    this.style.opacity = 1;
    setTimeout(() => {
        this.style.opacity = 0.1;
    });

    // Remove the element from the DOM after the fade out completes
    setTimeout(() => {
        if(typeof remove == "boolean") {
            this.style.display = "none";
        }
        if(remove == true) {
            this.remove();
        }
    }, ms);
}

/**
 * Makes an element fade in
 * @param {number} ms - Milliseconds you want the animation to last
 * @param {String} display - Display CSS property you want the element to have
 */
HTMLElement.prototype.fadeIn = function(ms = 500, display = false) {
    if(display != false) {
        this.style.display = display;
    }
    this.style.transition = `opacity ${ms}ms`;
    setTimeout(() => {
        this.style.opacity = 1;
    });
}