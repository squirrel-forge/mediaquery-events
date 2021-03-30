# mediaquery-events

Use media queries as event handlers, under the hood this uses **window.matchMedia** and **CustomEvent** so it is only compatible with current browsers.
You should be able to polyfill both issues with custom code if required.
The module offers a few more options than described here, please check the source comments for details.

If you have any feedback or issues, please feel free to submit an issue here: [github Issues](https://github.com/squirrel-forge/mediaquery-events/issues).

See the [CHANGELOG](CHANGELOG.md) for version details.

## Usage

```javascript
// Import the class
import { MediaQueryEvents } from 'mediaquery-events';

// Create instance with your preferred options
const media = new MediaQueryEvents( document, console );

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
