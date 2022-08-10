# Changelog

## 0.8.1
 - Added *MediaQueryEvents.reservedNames* static property to prevent creating invalid media queries for global bindings.

## 0.8.0
 - Full structural refactor, abilities and api remain unchanged in terms of backward compatibility following changes were made:
   - Constructor argument has changed to an *Object* with 3 options
   - *target* option, which represents the original constructor argument *eventTarget*
   - *ponyfill* option, which can be set to a constructor to be used as a fallback if the *MediaQueryListEvent* constructor cannot be called in the given browser.
   - *debug* option, which when set to *console* or a similar object, will supply error and event related information.
 - Added *MediaQueryListEventPonyFill* class for optionally pony filling *MediaQueryListEvent* constructor.
 - Updated the demo build.
 - Updated the precompiled version.
 - Updated and improved documentation.

## 0.7.0
 - Moved demo webpack
 - Added window bound webpack build version

## 0.6.0
 - Removed debugging code

## 0.5.0
 - Updated readme docs to include npm install reference

## 0.4.0
 - Updated changelog and npm package scope

## 0.3.0
 - Cleaned up the demo
 - Added a webpack config for the demo
 - Updated the readme

## 0.2.0
 - Added *event.detail.matches:boolean* to the custom event as a shortcut for *event.detail.event.matches*

## 0.1.0
 - Initial standalone version
