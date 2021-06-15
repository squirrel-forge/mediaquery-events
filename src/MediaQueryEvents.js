'use strict';

/**
 * Media Query Events class
 */
export class MediaQueryEvents {

    /**
     * Constructor
     *
     * @param {Document|HTMLElement} eventTarget - Element to dispatch events on
     */
    constructor( eventTarget = document ) {
        if ( !eventTarget || typeof eventTarget.dispatchEvent !== 'function' ) {
            throw new Error( this.constructor.name + '::constructor Must define a valid event target!' );
        }
        this._target = eventTarget;
        this._queries = {};
    }

    /**
     * Get or create new media query
     *
     * @protected
     *
     * @param {string} query - Media query
     *
     * @return {MediaQueryList}
     */
    _require_query( query ) {
        if ( !this._queries[ query ] ) {
            const media = window.matchMedia( query );

            // Bind global change handler
            media.onchange = ( event ) => this._event_media( event, query );
            this._queries[ query ] = media;
            return media;
        }
        return this._queries[ query ];
    }

    /**
     * Propagate media query event
     *
     * @protected
     *
     * @param {MediaQueryListEvent} event - Actual MediaQueryListEvent
     * @param {string} query - Media query
     * @param {boolean} forceEvents - Force the firing of the query event
     *
     * @return {void}
     */
    _event_media( event, query, forceEvents = false ) {

        // Make event data
        const data = {
            target : this,
            matches : event.matches,
            media : this._queries[ query ],
            event : event,
            query : query,
        };

        // Dispatch specific event on document
        this._dispatchEvent( 'media.' + ( event.matches ? 'on' : 'off' ), data );

        // Dispatch change event on document
        this._dispatchEvent( 'media.change', data );

        // Dispatch query event on self only on query match
        if ( forceEvents === true || event.matches ) {
            this._dispatchEvent( query, data );
        }
    }

    /**
     * Dispatch event
     *
     * @protected
     *
     * @param {string} name - Event name
     * @param {null|object} data - Event data
     *
     * @return {void}
     */
    _dispatchEvent( name, data = null ) {

        // Create event
        const event = new CustomEvent( name, { bubbles : true, cancelable : false, detail : data } );

        // Dispatch
        this._target.dispatchEvent( event );
    }

    /**
     * Require media queries
     *
     * @param {Array.<string>} queries - A list of media queries that are used as events
     *
     * @return {MediaQueryEvents}
     */
    requireQueries( queries ) {
        for ( let i = 0; i < queries.length; i++ ) {
            this._require_query( queries[ i ] );
        }
        return this;
    }

    /**
     * Dispatch event
     *
     * @param {string} query - Media query
     * @param {boolean} matches - Override the matching boolean
     *
     * @return {void}
     */
    dispatchEvent( query, matches = null ) {

        // Query is required/at least one event should be bound
        if ( !this._queries[ query ] ) {
            throw new Error( 'Unknown media query: ' + query );
        }

        // Fake the change event
        const event = new MediaQueryListEvent( 'change',{
            media : query,
            matches : matches || this._queries[ query ].matches,
        } );

        // Call the internal handler with query and fake event
        this._event_media( event, query, true );
    }

    /**
     * Register event listener
     *
     * @param {string} query - Media query
     * @param {Function} callback - Callback to register for event
     * @param {boolean|Object} useCapture - Capture style or options
     * @param {boolean} dontFire - Do not fire on match
     *
     * @return {MediaQueryEvents}
     */
    addEventListener( query, callback, useCapture = false, dontFire = false ) {

        // Get the required media query
        const media = this._require_query( query );

        // Add actual listener
        this._target.addEventListener( query, callback, useCapture );

        // Fire only new handler if matching initially
        if ( dontFire !== true && media.matches ) {

            // Get event data
            const data = {
                target : this,
                matches : true,
                media : media,
                query : query,
            };

            // Add fake list event
            data.event = new MediaQueryListEvent( 'change',{
                media : query,
                matches : true,
            } );

            // Create actual event
            const event = new CustomEvent( query, { bubbles : true, cancelable : false, detail : data } );

            // Run only the freshly bound handler
            callback.apply( this._target, [ event ] );
        }
        return this;
    }

    /**
     * Remove event listener
     *
     * @param {string} query - Media query
     * @param {function} callback - Callback to remove from event
     * @param {boolean|Object} useCapture - Capture style or options
     */
    removeEventListener( query, callback, useCapture = false ) {
        this._target.removeEventListener( query, callback, useCapture );
    }
}
