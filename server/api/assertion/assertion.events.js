/**
 * Assertion model events
 */

'use strict';

import {EventEmitter} from 'events';
var Assertion = require('../../sqldb').Assertion;
var AssertionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AssertionEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents() {
  for(var e in events) {
    let event = events[e];
    Assertion.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    AssertionEvents.emit(event + ':' + doc._id, doc);
    AssertionEvents.emit(event, doc);
    done(null);
  };
}

registerEvents();
export default AssertionEvents;
