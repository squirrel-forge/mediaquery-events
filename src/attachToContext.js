/**
 * Bind MediaQueryEvents instance to object property
 * @private
 * @param {window|document|HTMLElement|Object} target - Event target
 * @param {string} name - Context name on event target
 * @param {MediaQueryEvents} instance - MediaQueryEvents instance
 * @return {void}
 */
export function attachToContext( target, name, instance ) {
    if ( target &&  name && instance && typeof target[ name ] === 'undefined' ) {
        target[ name ] = instance;
    }
}
