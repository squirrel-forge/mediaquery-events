/**
 * Requires
 */
import { MediaQueryEvents, MediaQueryListEventPonyFill } from '../../index.js';

// Create instance with your preferred options
const media = new MediaQueryEvents( {
    ponyfill : MediaQueryListEventPonyFill,
    debug : console,
} );

/**
 * Event handler
 * @private
 * @param {CustomEvent} event - MediaQuery CustomEvent instance
 * @return {void}
 */
const _event_handler = ( event ) => {

    // The event name the listener was bound to
    //  if this is equal to event.detail.query this is not a global event
    const listener = event.type;

    // The media query string that is subject to this event
    const query = event.detail.query;

    // The query state
    //  note this can be overridden when manually using MediaQueryEvents.dispatchEvent() to trigger a media query event
    const matches = event.detail.event.matches;

    // Do something with this information

    // Set query on output container if it matches
    if ( matches ) {
        document.getElementById( 'query' ).innerText = query;
    }

    // Send event information to console if debug is enabled
    if ( media.debug ) media.debug.log( { listener, query, matches } );
};

// Bind some global events
media.addEventListener( 'media.on', _event_handler );
media.addEventListener( 'media.off', _event_handler );
media.addEventListener( 'media.change', _event_handler );

// And bind some actual events
media.addEventListener( '(max-width: 767px)', _event_handler );
media.addEventListener( '(min-width: 768px) and (max-width: 1024px)', _event_handler );
media.addEventListener( '(min-width: 1025px)', _event_handler );
