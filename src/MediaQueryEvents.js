/**
 * MediaQueryEvents
 * @class
 */
export class MediaQueryEvents {

    /**
     * Reserved event names
     *  no queries are created for those defined here since they would not work
     * @public
     * @static
     * @property
     * @type {Array<string>}
     */
    static reservedNames = [ 'media.on', 'media.off', 'media.change' ];

    /**
     * Debug object
     * @private
     * @property
     * @type {null|console|Object}
     */
    #debug = null;

    /**
     * Event target
     * @private
     * @property
     * @type {null|window|document|HTMLElement|Object}
     */
    #target = null;

    /**
     * Media queries reference
     * @private
     * @property
     * @type {Object}
     */
    #queries = {};

    /**
     * MediaQueryListEventPonyFill constructor
     * @private
     * @property
     * @type {null|MediaQueryListEventPonyFill|Function}
     */
    #ponyfill = null;

    /**
     * Constructor
     * @constructor
     * @param {window|document|HTMLElement|Object} target - Object to dispatch and bind events on
     * @param {null|Function} ponyfill - MediaQueryListEvent ponyfill object constructor
     * @param {null|console|Object} debug - Console or alike object to show debugging
     */
    constructor( { target = window, ponyfill = null, debug = null } = {} ) {
        if ( !target.addEventListener || !target.removeEventListener || !target.dispatchEvent ) {
            const msg = 'Must implement following methods: addEventListener, removeEventListener, dispatchEvent';
            throw new Error( 'MediaQueryEvents::constructor Argument { target } ' + msg );
        }
        this.#debug = debug;
        this.#target = target;
        if ( typeof ponyfill === 'function' ) this.#ponyfill = ponyfill;
    }

    /**
     * Target getter
     * @public
     * @return {window|document|HTMLElement|Object} - Event target
     */
    get target() {
        return this.#target;
    }

    /**
     * Debug getter
     * @public
     * @return {null|console|Object} - Debug reference
     */
    get debug() {
        return this.#debug;
    }

    /**
     * Debug setter
     * @public
     * @param {null|console|Object} state - Debug reference
     * @return {void}
     */
    set debug( state ) {
        if ( typeof state !== 'object' ) {
            throw new Error( 'MediaQueryEvents::debug Property value must be an Object or null' );
        }
        this.#debug = state;
    }

    /**
     * Get existing or create new media query
     * @private
     * @param {string} query - Media query string
     * @return {MediaQueryList|null} - MediaQueryList object representation of media query or null if reserved
     */
    #require_query( query ) {

        // Empty query or invalid type
        if ( typeof query !== 'string' || !query.length ) {
            throw new Error( 'MediaQueryEvents::#require_query Argument query must be a non empty string' );
        }

        // Check reserved event names
        if ( this.constructor.reservedNames.includes( query ) ) return null;

        // Create query
        if ( !this.#queries[ query ] ) {
            let media;
            try {
                media = window.matchMedia( query );
            } catch ( e ) {
                if ( this.#debug ) this.#debug.error( e );
                throw new Error( 'MediaQueryEvents::#require_query Argument query must be a valid media query' );
            }

            /**
             * Internal query event handler
             * @private
             * @param {MediaQueryListEvent} event - Event object
             * @return {void}
             */
            media.onchange = ( event ) => { this.#event_media( event, query ); };
            this.#queries[ query ] = media;
            return media;
        }

        // Return defined query
        return this.#queries[ query ];
    }

    /**
     * Create MediaQueryListEvent object
     * @private
     * @param {string} media - Media query
     * @param {boolean} matches - Query matches
     * @return {MediaQueryListEvent|MediaQueryListEventPonyFill|Object} - Event object
     */
    #get_MediaQueryListEvent( media, matches ) {
        let event;
        try {
            event = new MediaQueryListEvent( 'change', { media, matches } );
        } catch ( e ) {
            if ( this.#debug ) this.#debug.error( e );

            // Since we failed, we assume the given browser does not support the constructor
            if ( this.#ponyfill ) {
                const Construct = this.#ponyfill;
                event = new Construct( media, matches );
            } else {
                throw new Error( 'MediaQueryEvents::get_MediaQueryListEvent Failed to create event object, requires a ponyfill' );
            }
        }
        return event;
    }

    /**
     * Propagate media query event and dispatch custom events
     * @private
     * @param {MediaQueryListEvent} event - Actual MediaQueryListEvent
     * @param {string} query - Media query
     * @param {boolean} forceEvents - Force the firing of the query event
     * @return {void}
     */
    #event_media( event, query, forceEvents = false ) {

        // Make event data
        const matches = event.matches;
        const media = this.#queries[ query ];
        const data = { matches, media, event, query };
        data.target = this;

        // Dispatch specific event
        this.#dispatch_event( 'media.' + ( event.matches ? 'on' : 'off' ), data );

        // Dispatch change event
        this.#dispatch_event( 'media.change', data );

        // Dispatch query event only on query match
        if ( forceEvents === true || event.matches ) {
            this.#dispatch_event( query, data );
        }
    }

    /**
     * Internal dispatch event
     * @private
     * @param {string} name - Event name
     * @param {null|Object} data - Event data
     * @return {void}
     */
    #dispatch_event( name, data = null ) {

        // Create event
        const event = new CustomEvent( name, { bubbles : true, cancelable : false, detail : data } );

        // Dispatch event
        this.#target.dispatchEvent( event );
    }

    /**
     * Require multiple media queries
     * @public
     * @param {Array.<string>} queries - A list of media queries that are used as events
     * @return {MediaQueryEvents} - Instance for chaining
     */
    requireQueries( queries ) {
        if ( !( queries instanceof Array ) ) {
            throw new Error( 'MediaQueryEvents::requireQueries Argument queries must be an Array' );
        }
        for ( let i = 0; i < queries.length; i++ ) {
            this.#require_query( queries[ i ] );
        }
        return this;
    }

    /**
     * Dispatch media query event
     * @public
     * @param {string} query - Media query
     * @param {boolean} matches - Override the matching boolean
     * @return {MediaQueryEvents} - Instance for chaining
     */
    dispatchEvent( query, matches = null ) {

        // Query is required/at least one event should be bound
        if ( !this.#queries[ query ] ) {
            throw new Error( 'MediaQueryEvents::dispatchEvent Unknown media query: ' + query );
        }

        // Fake the change event, but expect errors on older browsers
        matches = typeof matches === 'boolean' ? matches : this.#queries[ query ].matches;
        const event = this.#get_MediaQueryListEvent( query, query, matches );

        // Call the internal handler with query and fake event
        this.#event_media( event, query, true );
        return this;
    }

    /**
     * Register media query event listener
     * @public
     * @param {string} query - Media query
     * @param {Function} callback - Callback to register for event
     * @param {boolean|Object} useCapture - Capture style or options
     * @param {boolean} dontFire - Do not fire on match during binding
     * @return {MediaQueryEvents} - Instance for chaining
     */
    addEventListener( query, callback, useCapture = false, dontFire = false ) {

        // Get the required media query
        const media = this.#require_query( query );

        // Add actual listener
        this.#target.addEventListener( query, callback, useCapture );

        // Fire new handler only if matching initially and not explicitly prevented
        if ( media && dontFire !== true && media.matches ) {

            // Get event data
            const matches = true;
            const data = { matches, media, query };
            data.target = this;

            // Add fake list event
            data.event = this.#get_MediaQueryListEvent( query, query, matches );

            // Create actual media query event
            const event = new CustomEvent( query, { bubbles : true, cancelable : false, detail : data } );

            // Run only the freshly bound handler
            callback.apply( this.#target, [ event ] );
        }
        return this;
    }

    /**
     * Remove media query event listener
     * @public
     * @param {string} query - Media query
     * @param {function} callback - Callback to remove from event
     * @param {boolean|Object} useCapture - Capture style or options
     * @return {MediaQueryEvents} - Instance for chaining
     */
    removeEventListener( query, callback, useCapture = false ) {
        this.#target.removeEventListener( query, callback, useCapture );
        return this;
    }
}
