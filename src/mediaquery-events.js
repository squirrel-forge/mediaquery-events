/* !
 * @module      : @squirrel-forge/mediaquery-events
 * @version     : 0.8.2
 * @license     : MIT
 * @copyright   : 2022 squirrel-forge
 * @author      : Daniel Hartwell aka. siux <me@siux.info>
 * @description : Use css media queries as javascript event names.
 */

/**
 * Requires
 */
import { MediaQueryEvents } from './MediaQueryEvents.js';
import { attachToContext } from './attachToContext.js';

// Create instance
const media = new MediaQueryEvents();

// Default context names
let names = [ 'media' ];

// Allow for global overrides
if ( window.mqe_OVERRIDE && window.mqe_OVERRIDE instanceof Array ) {
    names = window.mqe_OVERRIDE;
}

// Always define context.mqe if not taken
names.push( 'mqe' );

// Create global references
for ( let i = 0; i < names.length; i++ ) {
    attachToContext( media.target, names[ i ], media );
}
