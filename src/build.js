'use strict';

// Import the class
import { MediaQueryEvents } from './MediaQueryEvents.js';

// Create instance
window.mqe = new MediaQueryEvents();

// Create media alias if not defined
if ( typeof window.media === 'undefined' ) {
    window.media = window.mqe;
}
