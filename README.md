# mediaquery-events

Use media queries as event handlers, under the hood this uses **window.matchMedia**, **MediaQueryListEvent** and **CustomEvent** so it is only compatible with current browsers, see details on [caniuse](https://caniuse.com/mdn-api_mediaquerylistevent_mediaquerylistevent).
Polyfilling the missing parts should be possible, please feel free to add a polyfill setup to make it compatible with older browsers such as IE11 or Safari < 14. The big desktop browsers such as Edge, Chrome, Opera, Firefox all support the required parts of the api, even down to the current Chrome on Android 4.4.
The module offers a few more options than described here, please check the source comments for details.

If you have any feedback or issues, please feel free to submit an issue here: [github Issues](https://github.com/squirrel-forge/mediaquery-events/issues).

See the [CHANGELOG](CHANGELOG.md) for version details.

## Installing
```
# npm i @squirrel-forge/mediaquery-events
```
Since the code is es6 standard, it's recommended to use babel to transpile before shipping to production.
No precompiled version included currently.

## Usage

Import a precompiled webpack version that binds to **window.media** if not defined and is always available through **window.mqe**.
```javascript
import '../node_modules/@squirrel-forge/mediaquery-events/build/mediaquery-events.min.js';
```

Recommended usage:
```javascript
// Import the class
import { MediaQueryEvents } from '@squirrel-forge/mediaquery-events';

// Create instance with your preferred options
const media = new MediaQueryEvents( document );

// Define a handler
const _event_handler = ( event ) => {
    console.log( event.detail.event.matches ? 'Active' : 'Inactive', 'query >>>', event.detail.query );
};

// Bind some events
media.addEventListener( 'media.on', _event_handler );
media.addEventListener( 'media.off', _event_handler );
media.addEventListener( 'media.change', _event_handler );
media.addEventListener( '(max-width: 767px)', _event_handler );
media.addEventListener( '(min-width: 768px) and (max-width: 1024px)', _event_handler );
media.addEventListener( '(min-width: 1025px)', _event_handler );
```

## Notes on the events

All events can be bound to the given event target before initializing the MediaQueryEvents Object,
but it is important to notice that only the following events will always fire,
for all existing queries bound via the *MediaQueryEvents.addEventListener*
or created by *MediaQueryEvents.requireQueries* method:

 - **media.on** is fired once when a query goes active
 - **media.off** is fired once when a query goes inactive
 - **media.change** fires in both cases described above

Any actual media query events bound directly to the event target will only fire,
if the query itself is created on the *MediaQueryEvents* Object either by using the *MediaQueryEvents.addEventListener* method,
or you may initialize media queries as a list, independently at the time you wish to make them available with following method:

```javascript
media.requireQueries( [ '(max-width: 375px)' ] );
```
