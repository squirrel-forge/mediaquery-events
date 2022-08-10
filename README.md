# @squirrel-forge/mediaquery-events
**Use css media queries as javascript event names.**
Simply don't worry about matching css media queries with custom javascript code, just bind a listener with the query as the event name and be done, the actual module, depending on how you use or implement it will be ~5kb in size.

## Installation
```
npm i @squirrel-forge/mediaquery-events
```

## Technical background and compatibility
Under the hood this uses **window.matchMedia**, **MediaQueryListEvent** and **CustomEvent**, it is, therefore only compatible with the more recent browsers, see details on [caniuse MediaQueryListEvent](https://caniuse.com/mdn-api_mediaquerylistevent_mediaquerylistevent) if the module would work for you.

There is a ponyFill available for browsers, for example: Safari < 14, that do not allow *MediaQueryListEvent* objects to be constructed manually, but it must be included explicitly and is not included in the precompiled version.

Polyfilling the missing parts is possible, please feel free to add a polyfill setup to make it compatible with older browsers such as IE11. The big desktop and mobile browsers such as Edge, Chrome, Opera, Firefox all support the required abilities of the api. There are currently no explicit plans to supply any complete polyfill for browsers that do not support all required features beyond the optional ponyFill for the *MediaQueryListEvent* constructor.

---

## Recommended usage:

### Using es10 modules
Import the required class and or ponyFill from the module, you have full control.
```javascript
import { MediaQueryEvents, MediaQueryListEventPonyFill } from '@squirrel-forge/mediaquery-events';
```
Create an instance with your preferred options.
```javascript
const media = new MediaQueryEvents( {
    
    // Default target is the window object
    //  target can be anything that provides the basic event methods:
    //  addEventListener, removeEventListener, dispatchEvent
    target : ( window | document | HTMLElement | Object ),
    
    // By default the ponyfill is null and not available
    //  if set it will be used instead when the MediaQueryListEvent constructor cannot be called natively. 
    ponyfill : ( null | MediaQueryListEventPonyFill ),
    
    // By default debug is null
    //  if set to console, it will supply error and event related information for debugging.
    debug : ( null | console ),
} );
```
Now you can start [binding events](#binding-and-using-media-query-events).

---

## Legacy usage:

### Using the precompiled and minified webpack build
Import or include a precompiled webpack version that attempts to bind to **window.media** and **window.mqe** as long as these are previously undefined.
```javascript
import '@squirrel-forge/mediaquery-events/build/mediaquery-events.min.js';
```
Or:
```html
<script src=".../@squirrel-forge/mediaquery-events/build/mediaquery-events.min.js"
```
The *media* binding can be overridden by setting your own names as following:
```javascript
window.mqe_OVERRIDE = [ 'reference' ];
```
The *window.mqe* binding is always made unless defined and therefore blocked before loading the module.
Now you can start [binding events](#binding-and-using-media-query-events).

---

## Binding and using media query events

### for es10 and legacy
Define your event handlers.
```javascript
/**
 * Event handler 
 * @private
 * @param {CustomEvent} event - Mediaquery custom event
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
    console.log( { listener, query, matches } );
};
```
For example, bind your handlers to queries that cover mobile, tablet and desktop:
```javascript
media.addEventListener( '(max-width: 767px)', _event_handler );
media.addEventListener( '(min-width: 768px) and (max-width: 1024px)', _event_handler );
media.addEventListener( '(min-width: 1025px)', _event_handler );
```
You may also bind global events, these will fire for any query that was previously bound or required and changes it's state.
```javascript
media.addEventListener( 'media.on', _event_handler );
media.addEventListener( 'media.off', _event_handler );
media.addEventListener( 'media.change', _event_handler );
```
**Note**, that these only fire when at least one actual media query was bound or required.

All events can be bound to the given event target even before initializing the MediaQueryEvents Object:
```javascript
window.addEventListener( 'media.change', _event_handler );
window.addEventListener( '(max-width: 375px)', _event_handler );
```
but it is important to note that the events will only fire if the query is bound or required explicitly at some point:
```javascript
media.addEventListener( '(max-width: 375px)', _event_handler );

// OR

media.requireQueries( [ '(max-width: 375px)' ] );
```
If you do not wish to bind the media queries directly and want to use the global events only,
you can initialize multiple required queries easily without binding any handlers.
```javascript
// Require an Array of queries
media.requireQueries( [
    '(max-width: 767px)',
    '(min-width: 768px) and (max-width: 1024px)',
    '(min-width: 1025px)',
] );
```
Check the example for working code [demo.js source file](example/src/demo.js).

---

## Class definitions

### MediaQueryEvents
MediaQueryEvents class - Supplies media query event functionality.

#### Class overview
```javascript
class MediaQueryEvents {
    constructor( { target = window, ponyfill = null, debug = null } ) {}
    target : window|document|HTMLElement|Object // read only
    debug : null|console // settable
    requireQueries( queries ) {} // MediaQueryEvents
    dispatchEvent( query, matches = null ) {} // MediaQueryEvents
    addEventListener( query, callback, useCapture = false, dontFire = false ) {} // MediaQueryEvents
    removeEventListener( query, callback, useCapture = false ) {} // MediaQueryEvents
}
```
For more details check the [MediaQueryEvents source file](src/MediaQueryEvents.js).

#### Media query events
 - **{css media query}** - Fired whenever a query changes its state and matches.

#### Global events
 - **media.on** - Fired once when a query goes active.
 - **media.off** - Fired once when a query goes inactive.
 - **media.change** - Fires in both cases described above.

### MediaQueryListEventPonyFill
MediaQueryListEventPonyFill class - PonyFill class that provides a replacement object for when MediaQueryListEvent cannot be constructed.

#### Class overview
```javascript
class MediaQueryListEventPonyFill {
    constructor( media, matches ) {}
    media : string // read only
    matches : boolean // ready only
}
```
For more details check the [MediaQueryListEventPonyFill source file](src/MediaQueryListEventPonyFill.js).

---

## Issues
If you encounter any issues, please report [here](https://github.com/squirrel-forge/mediaquery-event/issues).

---

Check the sourcecode on [github](https://github.com/squirrel-forge/mediaquery-events) for detailed comments.
