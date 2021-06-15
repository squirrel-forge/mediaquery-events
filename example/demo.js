'use strict';

// Import the class
import { MediaQueryEvents } from '../src/MediaQueryEvents.js';

// Create instance with your preferred options
const media = new MediaQueryEvents( document, console );

/**
 * Event handler
 *
 * @private
 *
 * @param {CustomEvent} event - MediaQuery CustomEvent instance
 *
 * @return {void}
 */
const _event_handler = ( event ) => {
    if ( event.detail.event.matches ) {
        document.getElementById( 'query' ).innerText = event.detail.query;
    }
    console.log( event.detail.event.matches ? 'Active' : 'Inactive', 'query >>>', event.detail.query );
};

// Bind some events
media.addEventListener( 'media.on', _event_handler );
media.addEventListener( 'media.off', _event_handler );
media.addEventListener( 'media.change', _event_handler );
media.addEventListener( '(max-width: 767px)', _event_handler );
media.addEventListener( '(min-width: 768px) and (max-width: 1024px)', _event_handler );
media.addEventListener( '(min-width: 1025px)', _event_handler );
